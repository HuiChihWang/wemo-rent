import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/user/entity/user.entity';
import { Scooter } from '../src/scooter/entity/scooter.entity';
import { RentingHistory } from '../src/rent/entity/renting_histoy.entity';
import * as MockDate from 'mockdate';
import { OrderDto } from '../src/order/dto/order.dto';
import { IOrderService } from '../src/order/service/interface/order-service.interface';

describe('RentingController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let orderService: IOrderService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    dataSource = app.get(DataSource);
    orderService = app.get('ORDER_API_SERVICE');
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    MockDate.reset();

    const tables = await dataSource.query(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    `);

    for (const table of tables) {
      if (table.tablename === 'migrations') {
        continue;
      }
      await dataSource.query(`TRUNCATE TABLE "${table.tablename}" CASCADE`);
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  const givenUsers = async (data: unknown[]): Promise<User[]> => {
    const userRepo = dataSource.getRepository(User);
    const creationPromise = data.map((user) => userRepo.save(user));
    return Promise.all(creationPromise);
  };

  const givenScooters = async (data: unknown[]): Promise<Scooter[]> => {
    const scooterRepo = dataSource.getRepository(Scooter);
    const creationPromise = data.map((scooter) => scooterRepo.save(scooter));
    return Promise.all(creationPromise);
  };

  const givenUserInRentingSomeScooter = async (
    userName: string,
    scooterNo: string,
    rentOnTime: string,
  ) => {
    const userRepo = dataSource.getRepository(User);
    const scooterRepo = dataSource.getRepository(Scooter);
    const rentingHistoryRepo = dataSource.getRepository(RentingHistory);

    const user = userRepo.create({ userName });
    const savedUser = await userRepo.save(user);
    const scooter = scooterRepo.create({ scooterNo, status: 'RENTED' });
    const savedScooter = await scooterRepo.save(scooter);
    const history = await rentingHistoryRepo.save({
      userId: user.id,
      scooterId: savedScooter.id,
      startTime: new Date(rentOnTime),
      status: 'IN_RENT',
    });

    return { user: savedUser, history };
  };

  const setTestNow = (time: string) => {
    MockDate.set(time);
  };

  const givenUnpaidOrder = (isUnpaid: boolean = true) => {
    jest
      .spyOn(orderService, 'isUserHasUnpaidOrder')
      .mockResolvedValueOnce(isUnpaid);
  };

  const givenCreatedOrder = (data: OrderDto) => {
    jest.spyOn(orderService, 'createOrder').mockResolvedValueOnce(data);
  };

  describe('/rent/start (POST)', () => {
    const sendRentingApi = (data: any) => {
      return request(app.getHttpServer()).post('/rent/start').send(data);
    };

    it('should return 400 if request validation failed', async () => {
      const testRequests = [{}, { rentBy: 'user1' }, { scooterNo: 'ABC-DEF' }];
      for (const testRequest of testRequests) {
        await sendRentingApi(testRequest).expect(400);
      }
    });

    it('should return 404 if scooter not found', async () => {
      await givenUsers([{ userName: 'user1' }]);
      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      }).expect(404);
    });

    it('should return 404 if user not found', async () => {
      await givenScooters([{ scooterNo: 'ABC-DEF', status: 'AVAILABLE' }]);
      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      }).expect(404);
    });

    it('should return 400 if scooter is not available', async () => {
      await givenUsers([{ userName: 'user1' }]);
      await givenScooters([
        { scooterNo: 'ABC-DEF', status: 'RENTED' },
        { scooterNo: 'GHI-JKL', status: 'REPAIR' },
      ]);

      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      }).expect(400);
      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'GHI-JKL',
      }).expect(400);
    });

    it('should return 400 if user is renting some scooter', async () => {
      await givenScooters([{ scooterNo: 'ABC-DEF', status: 'AVAILABLE' }]);
      await givenUserInRentingSomeScooter(
        'user1',
        'GDF-ERT',
        '2021-01-01T00:00:00Z',
      );
      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      }).expect(400);
    });

    it('should return 201 if rent started', async () => {
      setTestNow('2021-01-01T00:00:00Z');

      await givenUsers([{ userName: 'user1' }]);
      await givenScooters([{ scooterNo: 'ABC-DEF', status: 'AVAILABLE' }]);
      givenUnpaidOrder(false);

      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      })
        .expect(201)
        .expect({
          rentOnTime: '2021-01-01T00:00:00.000Z',
          rentBy: 'user1',
          scooterNo: 'ABC-DEF',
        });
    });

    it('should return 400 if user has unpaid order', async () => {
      const [testUser] = await givenUsers([{ userName: 'user1' }]);
      await givenScooters([{ scooterNo: 'ABC-DEF', status: 'AVAILABLE' }]);
      givenUnpaidOrder();
      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      }).expect(400);
      expect(orderService.isUserHasUnpaidOrder).toHaveBeenCalledWith(
        testUser.id,
      );
    });
  });

  describe('/rent/return (POST)', () => {
    const sendReturnApi = (userName: string) => {
      return request(app.getHttpServer()).post('/rent/return').send({
        rentBy: userName,
      });
    };

    it('should return 400 if request is invalid', async () => {
      await sendReturnApi('').expect(400);
    });

    it('should return 404 if user not found', async () => {
      await sendReturnApi('user1').expect(404);
    });

    it('should return 400 if user is not renting any scooter', async () => {
      await givenUsers([{ userName: 'user1' }]);
    });

    it('should return 200 if scooter returned', async () => {
      setTestNow('2021-01-01T00:15:50Z');

      const { user, history } = await givenUserInRentingSomeScooter(
        'user1',
        'ABC-DEF',
        '2021-01-01T00:00:00Z',
      );

      givenCreatedOrder({
        orderNo: 'ORDER_TEST',
        userId: user.id,
        rentingHistoryId: history.id,
        amount: 32,
        status: 'PENDING',
        createdAt: new Date('2021-01-01T00:16:00Z'),
      });

      await sendReturnApi('user1').expect(200).expect({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
        rentOnTime: '2021-01-01T00:00:00.000Z',
        returnOnTime: '2021-01-01T00:15:50.000Z',
        rentTotalMinutes: 16,
        pricePerMinute: 2,
        totalPrice: 32,
        orderNo: 'ORDER_TEST',
        orderCreatedAt: '2021-01-01T00:16:00.000Z',
      });

      expect(orderService.createOrder).toHaveBeenCalledWith({
        userId: user.id,
        amount: 32,
        rentingId: history.id,
      });
    });
  });
});
