import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SttService } from './stt.service';
import { extname } from 'path';

@Controller('stt')
export class SttController {
  constructor(private readonly sttService: SttService) {}

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
  async process(
    @UploadedFile() file: Express.Multer.File, // Correct type
    @Body('userID') userID: number,
  ): Promise<string> {
    return await this.sttService.makeText(file, userID);
  }
}
