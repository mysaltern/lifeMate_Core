import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { ApiGatewayService } from './app.service';
import { ConversationModule } from './conversation/conversation.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join( '@app/common/.env.' + (process.env.NODE_ENV || 'development')), 
        join( '/.env.' + (process.env.NODE_ENV || 'development')),   
      ],
    }),
    TypeOrmModule.forFeature([ConversationModule]),
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
