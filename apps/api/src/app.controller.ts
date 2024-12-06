import { Controller, Get, Query, Res,Req, HttpStatus, Headers, UseGuards, BadRequestException, InternalServerErrorException  } from '@nestjs/common';
import { ApiGatewayService } from './app.service';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { CustomRequest } from './auth/custom-request.interface';

@Controller('api')
export class AppController {
  constructor(private readonly apiGatewayService: ApiGatewayService,
    private readonly configService: ConfigService) {}
   
    @UseGuards(AuthGuard)
    @Get('request')
    async process(
      @Query('text') text: string,
      @Req() req: CustomRequest, 
      @Headers('Authorization') authHeader: string
    ): Promise<any> {
      if (!text) {
        throw new BadRequestException('Text query parameter is required');
      }
    
      try {

        const userId = req.user.sub;
        const result = await this.apiGatewayService.processText(text,userId);
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
    