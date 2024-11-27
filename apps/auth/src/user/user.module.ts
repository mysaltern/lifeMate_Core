import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import  
 { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],  
 // Add this line
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Consider exporting if needed by other modules
})
export class UserModule {}