import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { ApiGatewayService } from './app.service';
import { ConversationModule } from './conversation/conversation.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    // Load environment file from libs/common
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), 'libs/common', `.env.${process.env.NODE_ENV || 'development'}`),
      expandVariables: true,
    }),
    // Load root environment file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
      expandVariables: true,
    }),
    TypeOrmModule.forFeature([ConversationModule]),
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const authUrl = this.configService.get('AUTH_URL');

    if (!authUrl) {
      throw new Error('AUTH_URL is not set correctly. Please check your environment configuration.');
    }
  }
}
