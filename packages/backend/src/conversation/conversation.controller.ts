import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
  UseGuards,
  ParseArrayPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UnPromisifiedResponse } from 'src/responses/UnpromisifiedResponse';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('conversation')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get('list')
  async findByIds(@Query('ids', ParseArrayPipe) ids: string[]) {
    const conversations = await this.conversationService.findByIds(ids);

    await Promise.all(
      conversations.map(
        (conversations) =>
          new Promise<void>(async (res) => {
            await conversations.users;
            await conversations.lastMessage;
            res();
          }),
      ),
    );

    return conversations
      .map<UnPromisifiedResponse<Conversation>>((conversation) => {
        return {
          id: conversation.id,
          createdAt: conversation.createdAt,
          messages: undefined,
          lastMessage: (conversation as any).__lastMessage__,
          users: (conversation as any).__users__,
        };
      })
      .sort((conversation1, conversation2) => {
        if (conversation1.lastMessage && conversation2.lastMessage) {
          return (
            conversation2.lastMessage.createdAt.getTime() -
            conversation1.lastMessage.createdAt.getTime()
          );
        }

        if (!conversation1.lastMessage && conversation2.lastMessage) {
          return 1;
        }

        if (conversation1.lastMessage && !conversation2.lastMessage) {
          return -1;
        }

        return 0;
      });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('getMessages') getMessages: boolean,
  ) {
    const conversation = await this.conversationService.findOne(id),
      response: UnPromisifiedResponse<Conversation> = {
        ...conversation,
        users: undefined,
        messages: undefined,
        lastMessage: undefined,
      };

    if (!conversation) {
      throw new NotFoundException();
    }

    await conversation.users;
    response.users = (conversation as any).__users__;

    await conversation.lastMessage;
    response.lastMessage = (conversation as any).__lastMessage__;

    if (getMessages) {
      await conversation.messages;
      response.messages = (conversation as any).__messages__;
      response.messages.sort(
        (message1, message2) =>
          message1.createdAt.getTime() - message2.createdAt.getTime(),
      );
    }

    return response;
  }
}
