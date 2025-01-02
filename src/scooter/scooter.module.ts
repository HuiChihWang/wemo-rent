import { Module } from '@nestjs/common';
import { ScooterService } from './service/scooter.service';
import { ScooterRepository } from './repository/scooter.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scooter } from './entity/scooter.entity';

@Module({
  providers: [ScooterService, ScooterRepository],
  exports: [ScooterService],
  imports: [TypeOrmModule.forFeature([Scooter])],
})
export class ScooterModule {}
