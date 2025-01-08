import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RentingHistoryRepository } from '../repository/renting_history.repo';
import { UserService } from '../../user/service/user.service';
import { ScooterService } from '../../scooter/service/scooter.service';
import { ScooterStatus } from '../../scooter/entity/scooter.entity';
import { RentingHistory, RentingStatus } from '../entity/renting_histoy.entity';
import { RentingRequest } from '../request/renting.request';
import { ReturnScooterRequest } from '../request/return-scooter.request';
import { RentingResult } from '../dto/renting-result.dto';
import { ReturningResultDto } from '../dto/returning-result.dto';
import { IOrderService } from '../../order/service/interface/order-service.interface';

@Injectable()
export class RentingService {
  constructor(
    @Inject('ORDER_API_SERVICE') private readonly orderService: IOrderService,
    private readonly scooterService: ScooterService,
    private readonly userService: UserService,
    private readonly rentingHistoryRepository: RentingHistoryRepository,
  ) {}

  public async startRent(
    rentingRequest: RentingRequest,
  ): Promise<RentingResult> {
    const { scooterNo, rentBy } = rentingRequest;

    const scooter = await this.scooterService.getScooterByScooterNo(scooterNo);
    if (!scooter) {
      throw new NotFoundException('Scooter does not exist');
    }
    const user = await this.userService.getUserByUserName(rentBy);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (await this.isUserAlreadyRentScooter(user.id)) {
      throw new BadRequestException('User is already renting a scooter');
    }

    if (scooter.status !== ScooterStatus.AVAILABLE) {
      throw new BadRequestException('Scooter is not available');
    }

    const scooterId = scooter.id;
    const userId = user.id;

    if (await this.orderService.isUserHasUnpaidOrder(userId)) {
      throw new BadRequestException('User has unpaid order');
    }

    await this.scooterService.changeScooterStatus(
      scooterId,
      ScooterStatus.RENTED,
    );

    const history = this.rentingHistoryRepository.create({
      scooterId,
      userId,
      startTime: new Date(),
      status: RentingStatus.IN_RENT,
    });

    await this.rentingHistoryRepository.save(history);

    return {
      rentBy: user,
      scooter: scooter,
      rentOnTime: history.startTime,
    };
  }

  public async returnScooter(
    returnRequest: ReturnScooterRequest,
  ): Promise<ReturningResultDto> {
    const userName = returnRequest.rentBy;
    const user = await this.userService.getUserByUserName(userName);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (!(await this.isUserAlreadyRentScooter(user.id))) {
      throw new BadRequestException('User is not renting any scooter');
    }

    const userId = user.id;
    const rentingHistory = await this.getRentingHistory(userId);
    rentingHistory.endTime = new Date();
    rentingHistory.status = RentingStatus.RETURNED;
    await this.rentingHistoryRepository.save(rentingHistory);

    const scooter = await this.scooterService.getScooterById(
      rentingHistory.scooterId,
    );

    await this.scooterService.changeScooterStatus(
      scooter.id,
      ScooterStatus.AVAILABLE,
    );

    const rentingPrice = this.calculateRentingPrice(rentingHistory);

    const order = await this.orderService.createOrder({
      userId,
      amount: rentingPrice,
      rentingId: rentingHistory.id,
    });

    return {
      order,
      rentBy: user,
      scooter,
      history: rentingHistory,
      detail: {
        totalMinutes: this.calculateTotalMinutes(
          rentingHistory.startTime,
          rentingHistory.endTime,
        ),
        pricePerMinute: 2,
      },
    };
  }

  private async getRentingHistory(
    userId: number,
  ): Promise<RentingHistory | null> {
    return this.rentingHistoryRepository.findOne({
      where: {
        userId,
        status: RentingStatus.IN_RENT,
      },
      order: { startTime: 'DESC' },
    });
  }

  private calculateRentingPrice(rentingHistory: RentingHistory): number {
    const rentStartTime = rentingHistory.startTime;
    const rentEndTime = rentingHistory.endTime;

    if (!rentEndTime) {
      throw new Error('Renting end time is not set');
    }

    const rentDurationRoundToMinutes = this.calculateTotalMinutes(
      rentStartTime,
      rentEndTime,
    );
    return rentDurationRoundToMinutes * 2;
  }

  private calculateTotalMinutes(startTime: Date, endTime: Date): number {
    const rentDuration = endTime.getTime() - startTime.getTime();
    return Math.ceil(rentDuration / 60000);
  }

  private async isUserAlreadyRentScooter(userId: number): Promise<boolean> {
    const rentingHistory = await this.rentingHistoryRepository.findOne({
      where: {
        userId,
        status: RentingStatus.IN_RENT,
      },
      order: { startTime: 'DESC' },
    });

    return !!rentingHistory;
  }
}
