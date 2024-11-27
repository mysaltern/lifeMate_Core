import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule,   ConfigModule.forRoot({
    isGlobal: true, // Makes ConfigModule available globally
  }),]
  ,
  controllers: [ChatgptController],
  providers: [ChatgptService],
})
export class ChatgptModule {}
