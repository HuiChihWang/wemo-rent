import { Injectable } from '@nestjs/common';
import {
  IOrderService,
  OrderListResponse,
  OrderResponse,
} from './interface/order-service.interface';
import { OrderDto } from '../dto/order.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrderStatus } from '../enum/order-status.enum';

@Injectable()
export class OrderService implements IOrderService {
  constructor(private readonly orderApiService: HttpService) {}

  public async createOrder(data: CreateOrderDto): Promise<OrderDto> {
    const response$ = this.orderApiService.post<OrderResponse>('/order', {
      rentingHistoryId: data.rentingId,
      userId: data.userId,
      amount: data.amount,
    });
    const { data: resData } = await firstValueFrom(response$);

    return {
      orderNo: resData.orderNo,
      rentingHistoryId: resData.rentingHistoryId,
      userId: resData.userId,
      amount: resData.amount,
      status: resData.status,
      createdAt: new Date(resData.createdAt),
    };
  }

  public async isUserHasUnpaidOrder(userId: number): Promise<boolean> {
    try {
      const response$ = this.orderApiService.get<OrderListResponse>(
        `/order/list`,
        {
          params: {
            userId: userId,
            status: OrderStatus.PENDING,
          },
        },
      );

      const { data: resData } = await firstValueFrom(response$);
      const total = resData.total;

      return total > 0;
    } catch (error) {
      console.log(error);
      return true;
    }
  }
}
