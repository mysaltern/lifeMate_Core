import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AppController } from './app.controller';
import { ApiGatewayService } from './app.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make the ConfigModule globally available in this service
      envFilePath: '.env', // Specify the .env file for this service
    }),
  ],
  controllers: [AppController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
