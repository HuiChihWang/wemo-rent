import { Injectable } from '@nestjs/common';
import { ScooterRepository } from '../repository/scooter.repository';
import { Scooter, ScooterStatus } from '../entity/scooter.entity';

@Injectable()
export class ScooterService {
  constructor(private readonly scooterRepository: ScooterRepository) {}

  public async getScooterByScooterNo(
    scooterNo: string,
  ): Promise<Scooter | null> {
    return this.scooterRepository.findOneBy({ scooterNo });
  }

  public async changeScooterStatus(scooterId: number, status: ScooterStatus) {
    const scooter = await this.scooterRepository.findOneBy({ id: scooterId });

    if (!scooter) {
      throw new Error('Scooter does not exist');
    }

    scooter.status = status;
    await this.scooterRepository.save(scooter);
  }
}
