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
  private readonly soundsDir: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });

    // Define the directory to store sound files
    this.soundsDir = path.resolve('./sounds');

    // Ensure the sounds directory exists
    if (!fs.existsSync(this.soundsDir)) {
      fs.mkdirSync(this.soundsDir, { recursive: true });
    }

    // Start periodic cleanup of old files
    setInterval(() => this.cleanupOldFiles(), 60 * 60 * 1000); // Every 60 minutes
  }

  async makeSound(inputText: string, userID: number): Promise<string> {
    try {
      console.log('TTS service called');
      const timestamp = Date.now();
      const fileName = `${userID}_${timestamp}.mp3`;
      const filePath = path.join(this.soundsDir, fileName);

      const inputString = String(inputText);
      const mp3 = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'onyx',
        input: inputString,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      await fs.promises.writeFile(filePath, buffer);
      console.log('Speech synthesis complete.');

      return fileName;
    } catch (error) {
      console.error('Error during TTS generation:', error);
      throw error;
    }
  }

  private cleanupOldFiles(): void {
    const now = Date.now();
    const sixtyMinutesAgo = now - 60 * 60 * 1000; // 60 minutes ago

    fs.readdir(this.soundsDir, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(this.soundsDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }

          // Delete files older than 60 minutes
          if (stats.mtimeMs < sixtyMinutesAgo) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
              } else {
                console.log(`Deleted old file: ${file}`);
              }
            });
          }
        });
      });
    });
  }
}
