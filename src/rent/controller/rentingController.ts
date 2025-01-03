import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RentingRequest } from '../request/renting.request';
import { ReturnScooterRequest } from '../request/return-scooter.request';
import { RentingService } from '../service/renting.service';
import { RentingResponse } from '../response/renting.response';
import { ReturnScooterResponse } from '../response/return-scooter.response';

@Controller('rent')
export class RentingController {
  constructor(private readonly rentingService: RentingService) {}

  @Post('start')
  @HttpCode(201)
  public async startRent(
    @Body() request: RentingRequest,
  ): Promise<RentingResponse> {
    return this.rentingService.startRent(request);
  }

  @Post('return')
  @HttpCode(200)
  public async finishRent(
    @Body() request: ReturnScooterRequest,
  ): Promise<ReturnScooterResponse> {
    return this.rentingService.returnScooter(request);
  }
}
