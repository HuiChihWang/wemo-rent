export interface OrderDto {
  orderNo: string;
  rentingHistoryId: number;
  userId: number;
  amount: number;
  status: string;
  createdAt: Date;
}
