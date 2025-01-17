import { NestFactory } from '@nestjs/core';
import { SttModule } from './stt.module';

async function bootstrap() {
  const app = await NestFactory.create(SttModule);
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
