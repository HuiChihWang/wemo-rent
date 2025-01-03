export class ReturnScooterResponse {
  rentBy: string;
  scooterNo: string;
  rentOnTime: Date;
  returnOnTime: Date;
  rentTotalMinutes: number;
  pricePerMinute: number;
  totalPrice: number;
  orderCreatedAt: Date;

  constructor(params: {
    rentBy: string;
    scooterNo: string;
    rentOnTime: Date;
    returnOnTime: Date;
    rentTotalMinutes: number;
    pricePerMinute: number;
    totalPrice: number;
    orderCreatedAt: Date;
  }) {
    this.rentBy = params.rentBy;
    this.scooterNo = params.scooterNo;
    this.rentOnTime = params.rentOnTime;
    this.returnOnTime = params.returnOnTime;
    this.rentTotalMinutes = params.rentTotalMinutes;
    this.pricePerMinute = params.pricePerMinute;
    this.totalPrice = params.totalPrice;
    this.orderCreatedAt = params.orderCreatedAt;
  }
}
