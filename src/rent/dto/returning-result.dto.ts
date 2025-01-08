import { OrderDto } from '../../order/dto/order.dto';
import { User } from '../../user/entity/user.entity';
import { Scooter } from '../../scooter/entity/scooter.entity';
import { RentingHistory } from '../entity/renting_histoy.entity';

interface RentingDetail {
  totalMinutes: number;
  pricePerMinute: number;
}

export interface ReturningResultDto {
  order: OrderDto;
  rentBy: User;
  scooter: Scooter;
  history: RentingHistory;
  detail: RentingDetail;
}
