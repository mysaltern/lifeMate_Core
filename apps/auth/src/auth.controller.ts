import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Post('validate-token')
  validateToken(@Body('token') token: string): any {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log(secret);

      console.log('miladAuth try');
      const decoded = jwt.verify(token, secret);
      return { valid: true, decoded };
    } catch (error) {
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log(secret);
      
      console.log('miladAuth catch');
      const decoded = jwt.verify(token, secret);
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }
}
