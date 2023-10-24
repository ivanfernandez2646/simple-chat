import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { WebSocketModule } from 'src/webSocket/webSocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User]), WebSocketModule],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
