import { Test, TestingModule } from '@nestjs/testing';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';

describe('ChatgptController', () => {
  let chatgptController: ChatgptController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatgptController],
      providers: [ChatgptService],
    }).compile();

    chatgptController = app.get<ChatgptController>(ChatgptController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatgptController.getHello()).toBe('Hello World!');
    });
  });
});
