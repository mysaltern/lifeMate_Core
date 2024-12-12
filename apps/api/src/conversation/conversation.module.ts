import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversation } from '@app/common/entities/conversation.entity';
import { User } from '@app/common/entities/user.entity';
import { ImportanceLevel } from '@app/common/entities/importanceLevel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, ImportanceLevel])],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
