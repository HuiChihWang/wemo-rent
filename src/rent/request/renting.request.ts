import { IsNotEmpty, IsString } from 'class-validator';

export class RentingRequest {
  @IsNotEmpty()
  @IsString()
  scooterNo: string;

  @IsNotEmpty()
  @IsString()
  rentBy: string;
}
