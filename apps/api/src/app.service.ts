import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(private readonly httpService: HttpService) {}

  // Main function to decide and process the text
  async processText(text: string): Promise<string> {
    // Decision logic to determine the best AI
    const bestAiService = this.selectBestAi(text);

    // Call the appropriate AI service
    switch (bestAiService) {
      case 'chatgpt':
        return await this.callOpenAiService(text);
      case 'llama':
        return await this.callLlamaService(text);
      case 'huggingface':
        return await this.callHuggingFaceService(text);
      default:
        throw new Error('No suitable AI service found.');
    }
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
  private async callOpenAiService(text: string): Promise<string> {
    const response = await lastValueFrom(
      this.httpService.post('http://chatgpt:3001/chatgpt/process', { text }),
    );
    return response.data;
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