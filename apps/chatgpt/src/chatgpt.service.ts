import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatgptService {
  constructor(private readonly httpService: HttpService) {}

  async callChatGptApi(text: string): Promise<string> {
  
    // console.log(999);
    const url = 'https://api.openai.com/v1/chat/completions';
    const apiKey = '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';

    const data = {
      model: 'gpt-4', // Replace with a valid model name
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text },
      ],
      max_tokens: 150,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    try { 
      const response = await lastValueFrom(
        this.httpService.post(url, data, { headers }),
      );
   
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error response data:', error.response?.data);
      console.error('Error calling OpenAI API:', error.response?.data || error.message);
      throw new Error(`OpenAI API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
