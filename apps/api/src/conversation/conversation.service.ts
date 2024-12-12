import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from '@app/common/entities/conversation.entity';
import { User } from '@app/common/entities/user.entity';
import { ImportanceLevel } from '@app/common/entities/importanceLevel.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ImportanceLevel)
    private readonly importanceLevelRepository: Repository<ImportanceLevel>,
  ) {}

  async createConversation(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const { userId, importanceLevelId, text, date } = createConversationDto;
  
   
    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
      throw new Error('Invalid user ID format');
    }
  
    const user = await this.userRepository.findOneBy({ id: numericUserId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const numericImportanceLevelId = Number(importanceLevelId);
    const importanceLevel = await this.importanceLevelRepository.findOneBy({
      id: numericImportanceLevelId,
    });
    if (!importanceLevel) {
      throw new NotFoundException('Importance level not found');
    }
  
    const conversation = this.conversationRepository.create({
      text,
      date,
      user,
      importanceLevel,
    });
  
    return this.conversationRepository.save(conversation);
  }
}
