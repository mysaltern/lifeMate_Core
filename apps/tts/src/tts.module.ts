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
      rootPath: resolveStaticFilePath(), // Dynamically resolve path without failing if it doesn't exist
      serveRoot: '/sounds',
    }),
  ],
  controllers: [TtsController],
  providers: [TtsService],
})
export class TtsModule {}

/**
 * Dynamically resolve the static file path, creating the folder if necessary.
 */
function resolveStaticFilePath(): string {
  const localPath = join(__dirname, '..', '..', '..', 'sounds'); // Localhost path
  const ecsPath = '/usr/src/app/sounds'; // ECS path

  const chosenPath = fs.existsSync(localPath) ? localPath : ecsPath;

  // Ensure the folder exists, create it if not
  if (!fs.existsSync(chosenPath)) {
    console.log(`Static files path does not exist. Creating: ${chosenPath}`);
    fs.mkdirSync(chosenPath, { recursive: true });
  }

  console.log(`Using static files path: ${chosenPath}`);
  return chosenPath;
}
