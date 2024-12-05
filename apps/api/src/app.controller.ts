import { Controller, Get, Query, Res, HttpStatus, Headers, UseGuards, BadRequestException, InternalServerErrorException  } from '@nestjs/common';
import { ApiGatewayService } from './app.service';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';

@Controller('api')
export class AppController {
  constructor(private readonly apiGatewayService: ApiGatewayService,
    private readonly configService: ConfigService) {}
   
    @UseGuards(AuthGuard)
    @Get('request')
    async process(
      @Query('text') text: string,
      @Headers('Authorization') authHeader: string
    ): Promise<any> {
      if (!text) {
        throw new BadRequestException('Text query parameter is required');
      }
    
      try {
        const result = await this.apiGatewayService.processText(text);
        return {
          statusCode: HttpStatus.OK,
          data: result,
          message: 'Text processed successfully',
        };
      } catch (error) {
        throw new InternalServerErrorException('Error processing text');
      }
    }
  }
    