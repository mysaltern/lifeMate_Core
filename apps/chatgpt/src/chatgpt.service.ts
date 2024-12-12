import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatgptService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.apiUrl = this.configService.get<string>('OPENAI_API_URL');
  }

  async callChatGptApi(text: string): Promise<string> {
    const data = {
      model: 'gpt-4o-mini',
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text },
      ],
      max_tokens: 1,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(this.apiUrl, data, { headers }),
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error response data:', error.response?.data);
      console.error('Error calling OpenAI API:', error.response?.data || error.message);
      throw new Error(`OpenAI API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
