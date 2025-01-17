import { Test, TestingModule } from '@nestjs/testing';
import { SttController } from './stt.controller';
import { SttService } from './stt.service';

describe('SttController', () => {
  let sttController: SttController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SttController],
      providers: [SttService],
    }).compile();

    sttController = app.get<SttController>(SttController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sttController.getHello()).toBe('Hello World!');
    });
  });
});
