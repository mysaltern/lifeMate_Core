import { Test, TestingModule } from '@nestjs/testing';
import { TtsController } from './tts.controller';
import { TtsService } from './tts.service';

describe('TtsController', () => {
  let ttsController: TtsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TtsController],
      providers: [TtsService],
    }).compile();

    ttsController = app.get<TtsController>(TtsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ttsController.getHello()).toBe('Hello World!');
    });
  });
});
