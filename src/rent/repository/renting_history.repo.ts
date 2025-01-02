import { Repository } from 'typeorm';
import { RentingHistory } from '../entity/renting_histoy.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RentingHistoryRepository extends Repository<RentingHistory> {
  constructor(
    @InjectRepository(RentingHistory)
    private readonly rentingHistoryRepository: Repository<RentingHistory>,
  ) {
    super(
      rentingHistoryRepository.target,
      rentingHistoryRepository.manager,
      rentingHistoryRepository.queryRunner,
    );
  }
}
