import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Req() req: Request, @Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create({
      ...createMessageDto,
      senderId: req.user.sub,
    });
  }
}
