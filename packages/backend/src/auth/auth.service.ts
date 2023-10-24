import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { GoogleUser } from 'src/auth/google/google-user';
import { JwtPayload } from 'src/auth/jwt/jwt.strategy';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async signIn(googleUser: GoogleUser) {
    const user = await this.userService.findOneByEmail(googleUser.email);

    if (!user) {
      await this.registerUser(googleUser);
    }

    const dbUser = await this.userService.findOneByEmail(googleUser.email);

    return this.generateJwt({
      sub: dbUser.id,
      email: dbUser.email,
    });
  }

  async registerUser(googleUser: GoogleUser) {
    await this.userService.create({
      id: randomUUID(),
      name: googleUser.firstName,
      surname: googleUser.lastName,
      email: googleUser.email,
      photoUrl: googleUser.picture,
      bioStatus: 'Default bio',
    });
  }
}
