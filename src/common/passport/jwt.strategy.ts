import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/api/users/users.service';
import { AccessTokensService } from 'src/api/access-tokens/access-tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private accessTokensService: AccessTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('APP_KEY'),
    });
  }

  /**
   * validate user
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    const accessToken = await this.accessTokensService.findOne(payload.jti);
    const user = await this.usersService.findById(payload.sub);

    if (
      !user ||
      !accessToken ||
      accessToken.revoked > 0 ||
      Date.now() > accessToken.expiresAt.getTime() ||
      user.deletedAt
    ) {
      throw new UnauthorizedException();
    }

    return { ...user, jti: payload.jti };
  }
}
