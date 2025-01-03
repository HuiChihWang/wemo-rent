import { OrderDto } from '../../dto/order.dto';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { OrderStatus } from '../../enum/order-status.enum';

export interface IOrderService {
  createOrder(data: CreateOrderDto): Promise<OrderDto>;
  isUserHasUnpaidOrder(userId: number): Promise<boolean>;
}

export interface OrderResponse {
  userId: number;
  rentingHistoryId: number;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderListResponse {
  total: number;
  orders: OrderResponse[];
}
