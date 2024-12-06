import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Conversation } from '../user/entities/conversation.entity';
import { ImportanceLevel } from '../user/entities/importanceLevel.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Conversation, ImportanceLevel]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for dynamic configuration
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Load secret from .env
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export if needed by other modules
})
export class UserModule {}
