import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: [
        join('@app/common/.env.' + (process.env.NODE_ENV || 'development')),
        join('./apps/tts/.env.' + (process.env.NODE_ENV || 'development')),
      ],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'sounds'), // Correct absolute path to 'sounds'
      serveRoot: '/sounds', // URL path for accessing files
    }),
  ],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}
