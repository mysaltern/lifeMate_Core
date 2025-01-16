import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as fs from 'fs';
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
      rootPath: getStaticFilePath(), // Dynamically determine the path
      serveRoot: '/sounds',
    }),
  ],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}

/**
 * Dynamically determine the static file path based on folder existence.
 */
function getStaticFilePath(): string {
  const localPath = join(__dirname, '..', '..', '..', 'sounds'); // Localhost path
  const ecsPath = '/usr/src/app/sounds'; // ECS path

  if (fs.existsSync(localPath)) {
    console.log(`Using local path for static files: ${localPath}`);
    return localPath;
  }

  if (fs.existsSync(ecsPath)) {
    console.log(`Using ECS path for static files: ${ecsPath}`);
    return ecsPath;
  }

  throw new Error('No valid static file path found. Ensure "sounds" directory exists.');
}
