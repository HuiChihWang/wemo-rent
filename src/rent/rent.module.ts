import { Module } from '@nestjs/common';
import { RentingController } from './controller/rentingController';
import { RentingService } from './service/renting.service';
import { ScooterModule } from '../scooter/scooter.module';
import { UserModule } from '../user/user.module';
import { RentingHistoryRepository } from './repository/renting_history.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentingHistory } from './entity/renting_histoy.entity';

@Module({
  controllers: [RentingController],
  providers: [RentingService, RentingHistoryRepository],
  imports: [
    ScooterModule,
    UserModule,
    TypeOrmModule.forFeature([RentingHistory]),
  ],
})
export class RentModule {}
