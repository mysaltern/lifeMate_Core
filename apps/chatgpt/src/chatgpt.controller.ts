import { Controller, Post, Body } from '@nestjs/common';
import { ChatgptService } from './chatgpt.service';

@Controller('chatgpt')
export class ChatgptController {
  constructor(private readonly chatgptService: ChatgptService) {}

  @Post('process')
  async process(@Body('text') text: string): Promise<string> {
    return await this.chatgptService.callChatGptApi(text);
  }
}