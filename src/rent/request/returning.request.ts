import { IsNotEmpty, IsString } from 'class-validator';

export class ReturningRequest {
  @IsNotEmpty()
  @IsString()
  userName: string;
}
