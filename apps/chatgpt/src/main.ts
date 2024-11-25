import { NestFactory } from '@nestjs/core';
import { ChatgptModule } from './chatgpt.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatgptModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
