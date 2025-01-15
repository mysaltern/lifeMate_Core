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


  async makeSound(inputText: string, userID: number): Promise<string> {
    try {
      console.log('tts called try');
      console.log(inputText);
      const timestamp = Date.now();
      const soundsDir = path.resolve('./sounds'); // Ensure this is correctly resolved
      const fileName = `${userID}_${timestamp}.mp3`;
      const _output = path.join(soundsDir, fileName);
  
      // Ensure sounds directory exists
      if (!fs.existsSync(soundsDir)) {
        fs.mkdirSync(soundsDir, { recursive: true });
      }
  
      const inputString = String(inputText); // Explicitly convert to string
      const mp3 = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'onyx',
        input: inputString, // Use the converted string here
      });
  
      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(_output, buffer);
      console.log('Speech synthesis complete.');
  
      return fileName; // Return only the file name or the relative path
    } catch (error) {
      console.log('tts called catch');
      console.log(inputText);
      console.log('Speech synthesis failed.');
      console.error(error);
      throw error; // Re-throw the error to handle it at a higher level
    }
  }
  
}