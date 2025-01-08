import { ReturningResultDto } from '../dto/returning-result.dto';

export class ReturnScooterResponse {
  rentBy: string;
  scooterNo: string;
  rentOnTime: Date;
  returnOnTime: Date;
  rentTotalMinutes: number;
  pricePerMinute: number;
  totalPrice: number;
  orderNo: string;
  orderCreatedAt: Date;

  constructor(params: {
    rentBy: string;
    scooterNo: string;
    rentOnTime: Date;
    returnOnTime: Date;
    rentTotalMinutes: number;
    pricePerMinute: number;
    totalPrice: number;
    orderNo: string;
    orderCreatedAt: Date;
  }) {
    this.rentBy = params.rentBy;
    this.scooterNo = params.scooterNo;
    this.rentOnTime = params.rentOnTime;
    this.returnOnTime = params.returnOnTime;
    this.rentTotalMinutes = params.rentTotalMinutes;
    this.pricePerMinute = params.pricePerMinute;
    this.totalPrice = params.totalPrice;
    this.orderNo = params.orderNo;
    this.orderCreatedAt = params.orderCreatedAt;
  }

  public static from(data: ReturningResultDto): ReturnScooterResponse {
    return new ReturnScooterResponse({
      rentBy: data.rentBy.userName,
      scooterNo: data.scooter.scooterNo,
      rentOnTime: data.history.startTime,
      returnOnTime: data.history.endTime,
      rentTotalMinutes: data.detail.totalMinutes,
      pricePerMinute: data.detail.pricePerMinute,
      totalPrice: data.order.amount,
      orderNo: data.order.orderNo,
      orderCreatedAt: data.order.createdAt,
    });
  }
}
