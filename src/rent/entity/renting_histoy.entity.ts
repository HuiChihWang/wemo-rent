import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RentingStatus {
  IN_RENT = 'IN_RENT',
  RETURNED = 'RETURNED',
}

@Entity('renting_histories')
export class RentingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'scooter_id' })
  scooterId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: RentingStatus,
    default: RentingStatus.IN_RENT,
  })
  status: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
