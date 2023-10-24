import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { UnPromisifiedResponse } from 'src/responses/UnpromisifiedResponse';

@Injectable()
@WebSocketGateway()
export class WebSocketService implements OnGatewayInit {
  @WebSocketServer()
  private server: Server;

  constructor(
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(_server) {}

  sendLastMessage(lastMessage: Message) {
    this.server.emit(`${lastMessage.conversationId}#lastMessage`, lastMessage);
  }

  async conversationCreated(conversation: Conversation) {
    await conversation.users;

    const conversationUnpromisified: UnPromisifiedResponse<Conversation> = {
      id: conversation.id,
      createdAt: conversation.createdAt,
      users: (conversation as any).__users__,
    };

    this.server.emit(`conversationCreated`, conversationUnpromisified);
  }

  @SubscribeMessage('markLastMessagesAsRead')
  async handleMarkLastMessagesAsReadEvent(
    @MessageBody()
    {
      conversationId,
      loggedUserId,
    }: {
      conversationId: string;
      loggedUserId: string;
    },
  ) {
    await this.messageService.markLastMessagesAsRead({
      conversationId,
      loggedUserId,
    });
  }

  @SubscribeMessage('startTyping')
  async handleStartTypingEvent(
    @MessageBody()
    {
      conversationId,
      loggedUserId,
    }: {
      conversationId: string;
      loggedUserId: string;
    },
  ) {
    this.server.emit('startTyping', { conversationId, userId: loggedUserId });
  }

  @SubscribeMessage('stopTyping')
  async handleStopTypingEvent(
    @MessageBody()
    {
      conversationId,
      loggedUserId,
    }: {
      conversationId: string;
      loggedUserId: string;
    },
  ) {
    this.server.emit('stopTyping', { conversationId, userId: loggedUserId });
  }
}
