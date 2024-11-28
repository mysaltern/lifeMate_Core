import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import  
 { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: 'MyCodeSaltLif#e@', 
          signOptions: { expiresIn: '1h' }, 
        }),
      ],
 // Add this line
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Consider exporting if needed by other modules
})
export class UserModule {}