import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('ORDER_API_URL'),
        timeout: 5000,
      }),
    }),
  ],
  providers: [{ provide: 'ORDER_API_SERVICE', useClass: OrderService }],
  exports: ['ORDER_API_SERVICE'],
})
export class OrderModule {}
