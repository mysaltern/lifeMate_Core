import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { CreateUserDto } from './user/dto/create-user.dto';  
import { CredentialsDto } from './user/dto/credentials.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<{ status: string; message: string }> {
    return this.authService.signUp(createUserDto.email, createUserDto.password);
  }

  @Post('/signin')
  async signIn(@Body() credentialsDto: CredentialsDto): Promise<{ status: string; message: string; accessToken?: string }> {
    return this.authService.signIn(credentialsDto.email, credentialsDto.password);
  }
}
