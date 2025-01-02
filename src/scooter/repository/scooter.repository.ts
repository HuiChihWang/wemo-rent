import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Scooter } from '../entity/scooter.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScooterRepository extends Repository<Scooter> {
  constructor(
    @InjectRepository(Scooter)
    private readonly scooterRepository: Repository<Scooter>,
  ) {
    super(
      scooterRepository.target,
      scooterRepository.manager,
      scooterRepository.queryRunner,
    );
  }
}
