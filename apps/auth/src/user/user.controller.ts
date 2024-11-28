import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from '../user/dto/credentials.dto'; 

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  
    @Post('/signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<{ status: string; message: string }> {
      return this.userService.signUp(createUserDto.email, createUserDto.password);
    }
  
    @Post('/signin')
    async signIn(@Body() credentialsDto: CredentialsDto): Promise<{ status: string; message: string; accessToken?: string }> {
      return this.userService.signIn(credentialsDto.email, credentialsDto.password);
    }
  }