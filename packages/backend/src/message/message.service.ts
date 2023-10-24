import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from 'src/message/entities/message.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import { WebSocketService } from 'src/webSocket/webSocket.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly webSocketService: WebSocketService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const users = await this.usersRepository.findBy({
      id: In([createMessageDto.senderId, createMessageDto.receiverId]),
    });

    if (users.length !== 2) {
      throw new Error('Users not found for the message');
    }

    const conversation = await this.conversationsRepository.findOneBy({
      id: createMessageDto.conversationId,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage = this.messagesRepository.create({
      id: createMessageDto.id,
      sender: users.find(
        (user) => user.id === createMessageDto.senderId,
      ) as unknown as Promise<User>,
      receiver: users.find(
        (user) => user.id === createMessageDto.receiverId,
      ) as unknown as Promise<User>,
      conversation: conversation as unknown as Promise<Conversation>,
      conversationForLastMessage:
        conversation as unknown as Promise<Conversation>,
      text: createMessageDto.text,
    });

    await this.messagesRepository.save(newMessage);
    await this.conversationsRepository.save({
      id: conversation.id,
      lastMessageId: newMessage.id,
    });
    this.webSocketService.sendLastMessage(newMessage);
  }

  async findLastInConversation(conversationId: string) {
    return this.messagesRepository.findOneOrFail({
      where: { conversationId },
      order: { createdAt: 'DESC' },
    });
  }

  async markLastMessagesAsRead({
    conversationId,
    loggedUserId,
  }: {
    conversationId: string;
    loggedUserId: string;
  }) {
    const conversation = await this.conversationsRepository.findOneByOrFail({
      id: conversationId,
    });

    await conversation.lastMessage;

    const lastMessage: Message | undefined = (conversation as any)
      .__lastMessage__;

    if (lastMessage && lastMessage.receiverId !== loggedUserId) {
      return;
    }

    return this.messagesRepository.update(
      {
        conversationId,
        isReadByReceiver: false,
        receiverId: loggedUserId,
      },
      { isReadByReceiver: true },
    );
  }
}
