import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { RentModule } from './rent/rent.module';
import { UserModule } from './user/user.module';
import { ScooterModule } from './scooter/scooter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { dataConfigFactory } from './database/data-config-factory';

@Module({
  imports: [
    OrderModule,
    RentModule,
    UserModule,
    ScooterModule,
    HttpModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dataConfigFactory,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
