import { RentingResult } from '../dto/renting-result.dto';

export class RentingResponse {
  rentOnTime: Date;
  rentBy: string;
  scooterNo: string;

  constructor(rentOnTime: Date, rentBy: string, scooterNo: string) {
    this.rentOnTime = rentOnTime;
    this.rentBy = rentBy;
    this.scooterNo = scooterNo;
  }

  public static from(data: RentingResult): RentingResponse {
    return new RentingResponse(
      data.rentOnTime,
      data.rentBy.userName,
      data.scooter.scooterNo,
    );
  }
}
