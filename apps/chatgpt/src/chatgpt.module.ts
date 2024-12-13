import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
@Module({
  imports: [HttpModule,   ConfigModule.forRoot({
    envFilePath: [
      join( '@app/common/.env.' + (process.env.NODE_ENV || 'development')), 
      join( './apps/chatgpt/.env.' + (process.env.NODE_ENV || 'development')),   
    ],
    isGlobal: true, 
  }),]
  ,
  controllers: [ChatgptController],
  providers: [ChatgptService],
})
export class ChatgptModule {}
