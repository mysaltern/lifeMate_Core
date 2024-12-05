import { Controller, Get, Query, Res, HttpStatus, Headers, HttpException } from '@nestjs/common';
import { ApiGatewayService } from './app.service';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Controller('api')
export class AppController {
  constructor(private readonly apiGatewayService: ApiGatewayService,
    private readonly configService: ConfigService) {}

  @Get('request')
  async process(
    @Query('text') text: string,
    @Headers('Authorization') authHeader: string,
    @Res() res: Response
  ): Promise<any> {
    if (!text) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Text query parameter is required',
      });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Authorization token is required',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      
      const secret = this.configService.get<string>('JWT_SECRET');
      // Validate JWT token
      const decoded = jwt.verify(token, secret);

      // Proceed with processing
      const result = await this.apiGatewayService.processText(text);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: result,
        message: 'Text processed successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired token',
        error: error.message,
      });
    }
  }
}
