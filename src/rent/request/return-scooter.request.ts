import { IsNotEmpty, IsString } from 'class-validator';

export class ReturnScooterRequest {
  @IsNotEmpty()
  @IsString()
  rentBy: string;
}
