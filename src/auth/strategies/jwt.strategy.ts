import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginService } from '../login.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt.payload';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
