import { Module } from '@nestjs/common';
import { RentingController } from './controller/renting.controller';
import { RentingService } from './service/renting.service';
import { ScooterModule } from '../scooter/scooter.module';
import { UserModule } from '../user/user.module';
import { RentingHistoryRepository } from './repository/renting_history.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentingHistory } from './entity/renting_histoy.entity';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [RentingController],
  providers: [RentingService, RentingHistoryRepository],
  imports: [
    ScooterModule,
    UserModule,
    OrderModule,
    TypeOrmModule.forFeature([RentingHistory]),
  ],
})
export class RentModule {}
