import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UnPromisifiedResponse } from 'src/responses/UnpromisifiedResponse';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request) {
    const user = await this.userService.findOne(req.user.sub),
      response: UnPromisifiedResponse<User> = {
        ...user,
        conversations: undefined,
      };

    if (!user) {
      throw new NotFoundException();
    }

    await user.conversations;
    response.conversations = (user as any).__conversations__;

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('getConversations') getConversations: boolean,
  ) {
    const user = await this.userService.findOne(id),
      response: UnPromisifiedResponse<User> = {
        ...user,
        conversations: undefined,
      };

    if (!user) {
      throw new NotFoundException();
    }

    if (getConversations) {
      await user.conversations;
      response.conversations = (user as any).__conversations__;
    }

    return response;
  }
}
