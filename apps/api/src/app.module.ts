import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { ApiGatewayService } from './app.service';

@Module({
  imports: [HttpModule], // Import HttpModule here
  controllers: [AppController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}