import { Controller, Get, Query, HttpException,Res, HttpStatus } from '@nestjs/common';
import { ApiGatewayService } from './app.service';
import { Response } from 'express';

@Controller('api')
export class AppController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get('request')
  async process(@Query('text') text: string, @Res() res: Response): Promise<any> {
    if (!text) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Text query parameter is required',
      });
    }

    try {
      const result = await this.apiGatewayService.processText(text);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: result,
        message: 'Text processed successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process text',
        error: error.message,
      });
    }
  }
}