import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from 'src/auth/google/google-oauth.guard';
import { GoogleUser } from 'src/auth/google/google-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Request() _req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const googleUser: GoogleUser = req.user;

    if (!googleUser) {
      throw new UnauthorizedException();
    }

    const token = await this.authService.signIn(googleUser);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
    });

    res.redirect(process.env.CLIENT_URL);
  }
}
