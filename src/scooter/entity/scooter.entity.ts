import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ScooterStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  REPAIR = 'REPAIR',
}

@Entity('scooters')
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'scooter_no', unique: true })
  scooterNo: string;

  @Column({ name: 'type', default: 'CANDY' })
  type: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ScooterStatus,
    default: ScooterStatus.AVAILABLE,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
