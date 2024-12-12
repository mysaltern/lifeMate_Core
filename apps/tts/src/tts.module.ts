import { Module } from '@nestjs/common';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [HttpModule,   ConfigModule.forRoot({
    // envFilePath: '/usr/src/app/.env',
    envFilePath: './apps/tts/.env',
    isGlobal: true, 
  }),]
  ,
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
