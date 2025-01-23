import { Injectable } from '@nestjs/common';
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from '@aws-sdk/client-transcribe-streaming';
import * as fs from 'fs';
import * as util from 'util';

@Injectable()
export class SttService {
  private readonly transcribeClient: TranscribeStreamingClient;
  private readonly unlinkFile = util.promisify(fs.unlink); // Promisify fs.unlink for async/await

  constructor() {
    console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID}`);
    this.transcribeClient = new TranscribeStreamingClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async makeText(file: Express.Multer.File, userID: number): Promise<string> {
    console.log(`Processing file for user: ${userID}`);
    console.log(`File received: ${file.originalname}`);

    const audioStream = fs.createReadStream(file.path, { highWaterMark: 3200 });

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      MediaSampleRateHertz: 16000,
      MediaEncoding: 'pcm',
      AudioStream: this.audioStreamGenerator(audioStream),
    });

    let transcription = '';
    const response = await this.transcribeClient.send(command);

    try {
      for await (const event of response.TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const results = event.TranscriptEvent.Transcript.Results;
          for (const result of results) {
            if (!result.IsPartial) {
              transcription += result.Alternatives[0].Transcript + ' ';
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing transcription:', error);
      throw error;
    } finally {
      // Delete the chunk file after transcription is complete
      try {
        await this.unlinkFile(file.path);
        console.log(`Deleted file: ${file.path}`);
      } catch (unlinkError) {
        console.error(`Failed to delete file: ${file.path}`, unlinkError);
      }
    }

    return transcription.trim();
  }

  private async *audioStreamGenerator(audioStream: fs.ReadStream) {
    for await (const chunk of audioStream) {
      yield { AudioEvent: { AudioChunk: chunk } };
    }
  }
}
