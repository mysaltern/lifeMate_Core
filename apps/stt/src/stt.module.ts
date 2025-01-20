import { Module, OnModuleInit } from '@nestjs/common';
import { SttController } from './stt.controller';
import { SttService } from './stt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), 'libs/common', `.env.${process.env.NODE_ENV || 'development'}`),
      expandVariables: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
      expandVariables: true,
    }),
  ],
  controllers: [SttController],
  providers: [SttService],
})
export class SttModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  
  onModuleInit() {
    console.log(`AWS_API_KEY: ${this.configService.get<string>('AWS_API_KEY')}`);
  }
}
