import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/user/entity/user.entity';
import { Scooter } from '../src/scooter/entity/scooter.entity';

describe('RentingController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    const tables = await dataSource.query(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    `);

    for (const table of tables) {
      await dataSource.query(`TRUNCATE TABLE "${table.tablename}" CASCADE`);
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

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
      await givenScooters([{ scooterNo: 'ABC-DEF' }]);
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
      await givenUsers([{ userName: 'user1', inRent: true }]);
      await givenScooters([{ scooterNo: 'ABC-DEF' }]);
      await sendRentingApi({
        rentBy: 'user1',
        scooterNo: 'ABC-DEF',
      }).expect(400);
    });

    it('should return 201 if rent started', async () => {
      givenTestCurrentTime('2021-01-01');

      await givenUsers([{ userName: 'user1' }]);
      await givenScooters([{ scooterNo: 'ABC-DEF' }]);
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

    const givenUsers = async (data: unknown[]) => {
      const userRepo = dataSource.getRepository(User);
      const creationPromise = data.map((user) => userRepo.save(user));
      await Promise.all(creationPromise);
    };

    const givenScooters = async (data: unknown[]) => {
      const scooterRepo = dataSource.getRepository(Scooter);
      const creationPromise = data.map((scooter) => scooterRepo.save(scooter));
      await Promise.all(creationPromise);
    };

    const givenTestCurrentTime = (time: string) => {
      const mockedNow = new Date(time);
      jest.spyOn(global, 'Date').mockImplementation(() => mockedNow);
    };
  });
});
