import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { Order } from '../entity/order.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async createOrder(
    userId: number,
    rentingId: number,
    amount: number,
  ): Promise<Order> {
    return this.orderRepository.create({
      userId,
      rentingHistoryId: rentingId,
      amount,
    });
  }
}
