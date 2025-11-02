import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    const configService = new ConfigService();

    console.log(req.headers);

    if (!req.session.token) {
      throw new UnauthorizedException("You're logged out. Please login again!");
    } else {
      JWT.verify(
        req.session.token,
        configService.get('APP_KEY'),
        function (err: any) {
          if (err) {
            throw new UnauthorizedException(
              "You're logged out. Please login again!",
            );
          }
        },
      );
    }
    next();
  }
}
