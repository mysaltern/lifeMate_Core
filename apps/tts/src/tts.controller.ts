import { Controller, Post ,Body} from '@nestjs/common';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post('process')
  async process(
    @Body('text') text: string, 
    @Body('userID') userID: number 
  ): Promise<string> {
    return await this.ttsService.makeSound(text,userID);
  }
}



