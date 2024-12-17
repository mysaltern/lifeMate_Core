import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TtsService {
  private readonly apiKey: string;
  private readonly openai: OpenAI;
  private readonly _output: string;


  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY'); 
    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });
  }


  async makeSound(inputText: string,userID: number): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `./sounds/${userID}_${timestamp}.mp3`;
      const _output = path.resolve(fileName); 
      const inputString = String(inputText); // Explicitly convert to string

      const mp3 = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'onyx',
        input: inputString, // Use the converted string here
      });

      if (fs.existsSync(_output)) {
        fs.unlinkSync(_output);
      }

      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(_output, buffer);
      console.log('Speech synthesis complete.');

      return fileName; 
    } catch (error) {
      console.log('Speech synthesis failed.');
      console.error(error);
    }
  }
}