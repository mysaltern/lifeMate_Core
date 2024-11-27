import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { CreateUserDto } from './user/dto/create-user.dto';  
 // You'll need to create this DTO
import { CredentialsDto } from './user/dto/credentials.dto'; // You'll need to create this DTO

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto):  
 Promise<void> {
    return this.authService.signUp(createUserDto.email,  
 createUserDto.password);
  }

  @Post('/signin')
  signIn(@Body() credentialsDto: CredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(credentialsDto.email, credentialsDto.password);
  }
}