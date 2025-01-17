import { Controller, Get } from '@nestjs/common';
import { SttService } from './stt.service';

@Controller()
export class SttController {
  constructor(private readonly sttService: SttService) {}

  @Get()
  getHello(): string {
    return this.sttService.getHello();
  }
}
