import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RentingRequest } from '../request/renting.request';
import { ReturningRequest } from '../request/returning.request';
import { RentingService } from '../service/renting.service';
import { RentingResponse } from '../response/renting.response';

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
  public async finishRent(@Body() request: ReturningRequest) {
    await this.rentingService.returnScooter(request);
    return 'Rent finished';
  }
}
