import { Injectable } from '@nestjs/common';
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from '@aws-sdk/client-transcribe-streaming';
import * as fs from 'fs';

@Injectable()
export class SttService {
  private readonly transcribeClient: TranscribeStreamingClient;

  constructor() {
    console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID}`);
    this.transcribeClient = new TranscribeStreamingClient({
      region: 'us-east-1', // Replace with your AWS region
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use environment variables for security
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async makeText(file: Express.Multer.File, userID: number): Promise<string> {
    console.log(`Processing file for user: ${userID}`);
    console.log(`File received: ${file.originalname}`);

    // Open the audio file as a stream with a chunk size of 3.2 KB
    const audioStream = fs.createReadStream(file.path, { highWaterMark: 3200 }); // 3.2 KB chunks

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US', // Update with the appropriate language code
      MediaSampleRateHertz: 16000, // Update with the audio sample rate
      MediaEncoding: 'pcm', // AWS Transcribe requires raw PCM data
      AudioStream: this.audioStreamGenerator(audioStream), // Stream generator
    });

    const response = await this.transcribeClient.send(command);
    let transcription = '';

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
    }

    console.log(`Final Transcription: ${transcription.trim()}`);
    return transcription.trim();
  }

  private async *audioStreamGenerator(
    audioStream: fs.ReadStream,
  ): AsyncGenerator<{ AudioEvent: { AudioChunk: Buffer } }> {
    for await (const chunk of audioStream) {
      console.log(`Sending chunk of size: ${chunk.length} bytes`);
      yield { AudioEvent: { AudioChunk: chunk } };
    }
  }
}
