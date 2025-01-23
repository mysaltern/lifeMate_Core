import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  Headers,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { ApiGatewayService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { CustomRequest } from './auth/custom-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';

@Controller('api')
export class AppController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // Existing @Get('request') endpoint
  @UseGuards(AuthGuard)
  @Get('request')
  async handleRequest(
    @Query('text') text: string,
    @Req() req: CustomRequest,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    if (!text) {
      throw new BadRequestException('Text query parameter is required');
    }

    try {
      const userId = req.user.sub;
      const result = await this.apiGatewayService.processText(text, userId);
      return {
        statusCode: HttpStatus.OK,
        data: result,
        message: 'Text processed successfully',
      };
    } catch (error) {
      console.error('Error during text processing:', error);
      throw new InternalServerErrorException('Error processing text');
    }
  }

  // New @Post('process') endpoint
  @UseGuards(AuthGuard)
  @Post('process')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async processFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
    @Headers('Authorization') authHeader: string,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const STT_URL = this.configService.get<string>('STT_URL') || 'http://stt:3004';
      console.log(`STT_URL: ${STT_URL}`);

      const userId = req.user.sub;

      // Create form-data for file upload
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path));
      formData.append('userID', userId.toString());

      // Send the file to the STT service
      const response = await lastValueFrom(
        this.httpService.post(`${STT_URL}/stt/process`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );

      // Extract transcription result
      const transcription = response.data;

      // Call processText with transcription result
      const result = await this.apiGatewayService.processText(transcription, userId);

      // Clean up the file
      fs.unlinkSync(file.path);

      return {
        statusCode: HttpStatus.OK,
        data: result,
        message: 'File processed successfully',
      };
    } catch (error) {
      console.error('Error during file processing:', error);

      // Cleanup file in case of error
      if (file && file.path) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up uploaded file:', unlinkError);
        }
      }

      throw new InternalServerErrorException('Error processing file');
    }
  }
}
