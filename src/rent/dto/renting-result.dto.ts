import { User } from '../../user/entity/user.entity';
import { Scooter } from '../../scooter/entity/scooter.entity';

export interface RentingResult {
  rentOnTime: Date;
  rentBy: User;
  scooter: Scooter;
}
