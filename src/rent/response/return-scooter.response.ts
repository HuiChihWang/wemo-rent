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
}
