import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule,   ConfigModule.forRoot({
    // envFilePath: '/usr/src/app/.env',
    envFilePath: './apps/chatgpt/.env',
    isGlobal: true, 
  }),]
  ,
  controllers: [ChatgptController],
  providers: [ChatgptService],
})
export class ChatgptModule {}
