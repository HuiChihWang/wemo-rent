export class RentingResponse {
  rentOnTime: Date;
  rentBy: string;
  scooterNo: string;

  constructor(rentOnTime: Date, rentBy: string, scooterNo: string) {
    this.rentOnTime = rentOnTime;
    this.rentBy = rentBy;
    this.scooterNo = scooterNo;
  }
}
