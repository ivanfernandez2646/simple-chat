import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { WebSocketService } from 'src/webSocket/webSocket.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly webSocketService: WebSocketService,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const users = await this.usersRepository.findBy({
      id: In(createConversationDto.userIds),
    });

    if (users.length !== createConversationDto.userIds.length) {
      throw new Error('Users not found for the conversation');
    }

    let newConversation = this.conversationsRepository.create({
      id: createConversationDto.id,
      users: users as unknown as Promise<User[]>,
    });
    newConversation = await this.conversationsRepository.save(newConversation);
    await this.webSocketService.conversationCreated(newConversation);
  }

  findOne(id: string) {
    return this.conversationsRepository.findOneBy({ id });
  }

  findByIds(ids: string[]) {
    return this.conversationsRepository.findBy({ id: In(ids) });
  }
}
