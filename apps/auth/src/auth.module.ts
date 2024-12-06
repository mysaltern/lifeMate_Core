import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { DatabaseModule } from '../../../libs/common/src/database/database.module'; // Import the database module

@Module({
  imports: [
    DatabaseModule, // Use the centralized database configuration
    TypeOrmModule.forFeature([User]), // Register the User entity
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}