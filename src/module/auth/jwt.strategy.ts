import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lấy token từ header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { _id: payload.sub, email: payload.email };
  }
}
