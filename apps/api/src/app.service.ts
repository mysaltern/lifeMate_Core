import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConversationService } from './conversation/conversation.service'; 
import { CreateConversationDto } from './conversation/dto/create-conversation.dto';
import { ConfigService } from '@nestjs/config';
 
@Injectable()
export class ApiGatewayService {
  constructor(
    private readonly httpService: HttpService,
    private readonly conversationService: ConversationService,
    private configService: ConfigService
  ) {}

  // Main function to decide and process the text
  async processText(text: string,userID: number): Promise<string> {
    // Decision logic to determine the best AI
    const bestAiService = this.selectBestAi(text);
    const loadHistory = this.loadHistory(userID);
    const createConversationDto: CreateConversationDto = {
      text,
      date: new Date().toISOString(),
      userId: userID, 
      importanceLevelId: '1',
    };
 
    const newConversation = await this.conversationService.createConversation(createConversationDto);
    console.log('New conversation created:', newConversation);
    console.log(99999);
    // Call the appropriate AI service
    switch (bestAiService) {
      case 'chatgpt':
        return await this.callOpenAiService(text,userID);
      case 'llama':
        return await this.callLlamaService(text);
      case 'huggingface':
        return await this.callHuggingFaceService(text);
      default:
        throw new Error('No suitable AI service found.');
    }
  }


  private loadHistory(userID:number)
  {
    return ['its history',' last one'];
  }
  // Decision logic
  private selectBestAi(text: string): string {
    // Example logic: Choose AI based on text length
    if (text.length < 50) {
      return 'chatgpt'; // Use OpenAI for short texts
    } else if (text.length < 200) {
      return 'llama'; // Use LLaMA for medium texts
    } else {
      return 'huggingface'; // Use Hugging Face for long texts
    }
  }

  // Call OpenAI Service
  private async callOpenAiService(text: string,userID:number): Promise<string> {
    // history = null ;
    console.log('miladdddd');
    const CHATGPT_URL = this.configService.get<string>('CHATGPT_URL');

    const response = await lastValueFrom(
      this.httpService.post<{ text: string | number }>(`${CHATGPT_URL}/chatgpt/process`, { text })

    );
 
    const TTS_URL = this.configService.get<string>('TTS_URL');
    const voice = await lastValueFrom(
      this.httpService.post(`${TTS_URL}/tts/process`, { 
        text: response.data,
        userID:userID
      })
    );

    return voice.data;
    
  }

  // Call LLaMA Service
  private async callLlamaService(text: string): Promise<string> {
    return '2';
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:3002/llama/process', { text }),
    );
    return response.data.result;
  }

  // Call Hugging Face Service
  private async callHuggingFaceService(text: string): Promise<string> {
    return '3';
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:3003/huggingface/process', { text }),
    );
    return response.data.result;
  }
}