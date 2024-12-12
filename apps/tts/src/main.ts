import { NestFactory } from '@nestjs/core';
import { TtsModule } from './tts.module';

async function bootstrap() {
  const app = await NestFactory.create(TtsModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
