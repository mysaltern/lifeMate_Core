import { Module } from '@nestjs/common';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
console.log(process.env.NODE_ENV);
@Module({
  imports: [HttpModule,   ConfigModule.forRoot({
    envFilePath: [
      join( '@app/common/.env.' + (process.env.NODE_ENV || 'development')), 
      join( './apps/tts/.env.' + (process.env.NODE_ENV || 'development')),   
    ],
    isGlobal: true, 
  }),]
  ,
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
