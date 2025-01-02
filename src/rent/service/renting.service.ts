import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RentingHistoryRepository } from '../repository/renting_history.repo';
import { UserService } from '../../user/service/user.service';
import { ScooterService } from '../../scooter/service/scooter.service';
import { ScooterStatus } from '../../scooter/entity/scooter.entity';
import { RentingHistory, RentingStatus } from '../entity/renting_histoy.entity';
import { RentingRequest } from '../request/renting.request';
import { ReturningRequest } from '../request/returning.request';
import { RentingResponse } from '../response/renting.response';

@Injectable()
export class RentingService {
  constructor(
    private readonly scooterService: ScooterService,
    private readonly userService: UserService,
    private readonly rentingHistoryRepository: RentingHistoryRepository,
  ) {}

  public async startRent(
    rentingRequest: RentingRequest,
  ): Promise<RentingResponse> {
    const { scooterNo, rentBy } = rentingRequest;

    const scooter = await this.scooterService.getScooterByScooterNo(scooterNo);
    if (!scooter) {
      throw new NotFoundException('Scooter does not exist');
    }
    const user = await this.userService.getUserByUserName(rentBy);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (user.inRent) {
      throw new BadRequestException('User is already renting a scooter');
    }

    if (scooter.status !== ScooterStatus.AVAILABLE) {
      throw new BadRequestException('Scooter is not available');
    }

    const scooterId = scooter.id;
    const userId = user.id;

    // TODO: check if user has any unpaid order

    await this.scooterService.changeScooterStatus(
      scooterId,
      ScooterStatus.RENTED,
    );

    await this.userService.changeUserRentStatus(userId, true);

    const history = this.rentingHistoryRepository.create({
      scooterId,
      userId,
      startTime: new Date(),
      status: RentingStatus.IN_RENT,
    });

    await this.rentingHistoryRepository.save(history);

    return new RentingResponse(
      history.startTime,
      user.userName,
      scooter.scooterNo,
    );
  }

  public async returnScooter(returnRequest: ReturningRequest): Promise<void> {
    const userName = returnRequest.userName;
    const user = await this.userService.getUserByUserName(userName);

    if (!user) {
      throw new Error('User does not exist');
    }

    if (!user.inRent) {
      throw new Error('User is not renting any scooter');
    }

    const userId = user.id;
    const rentingHistory = await this.getRentingHistory(userId);
    rentingHistory.endTime = new Date();
    rentingHistory.status = RentingStatus.RETURNED;
    await this.rentingHistoryRepository.save(rentingHistory);

    await this.scooterService.changeScooterStatus(
      rentingHistory.scooterId,
      ScooterStatus.AVAILABLE,
    );

    await this.userService.changeUserRentStatus(userId, false);

    const rentingPrice = this.calculateRentingPrice(rentingHistory);

    // TODO: create order here
  }

  private async getRentingHistory(
    userId: number,
  ): Promise<RentingHistory | null> {
    return this.rentingHistoryRepository.findOneBy({
      userId,
      status: RentingStatus.IN_RENT,
    });
  }

  private calculateRentingPrice(rentingHistory: RentingHistory): number {
    const rentStartTime = rentingHistory.startTime;
    const rentEndTime = rentingHistory.endTime;

    if (!rentEndTime) {
      throw new Error('Renting end time is not set');
    }

    const rentDuration = rentEndTime.getTime() - rentStartTime.getTime();
    const rentDurationRoundToMinutes = Math.ceil(rentDuration / 60000);
    return rentDurationRoundToMinutes * 2;
  }
}