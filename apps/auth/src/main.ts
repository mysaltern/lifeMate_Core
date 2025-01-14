import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3002);
}
console.log("CICD worked for auth 4");
bootstrap();   