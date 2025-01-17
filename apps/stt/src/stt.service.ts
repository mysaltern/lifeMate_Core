import { Injectable } from '@nestjs/common';

@Injectable()
export class SttService {
  getHello(): string {
    return 'Hello World!';
  }
}
