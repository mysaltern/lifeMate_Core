import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { CreateUserDto } from './user/dto/create-user.dto';  
import { CredentialsDto } from './user/dto/credentials.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

 
}
