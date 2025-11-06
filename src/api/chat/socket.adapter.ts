import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsException } from '@nestjs/websockets';
import { Server, ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccessTokensService } from '../access-tokens/access-tokens.service';

export class SocketAdapter extends IoAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly jwtService: JwtService,
    private readonly accessTokensService: AccessTokensService,
    private readonly usersService: UsersService,
  ) {
    super(app);
  }

  createIOServer(port: number, options: ServerOptions) {
    const io: Server = super.createIOServer(port, options);

    io.use(async (socket, next) => {
      const { token } = socket.handshake.auth;

      if (!token) {
        return next(new WsException('UnauthorizedException'));
      }

      // Decode JWT
      const decodedToken = this.jwtService.decode(token);

      if (!decodedToken) {
        return next(new WsException('UnauthorizedException'));
      }

      // Check JWT token is expired?
      const isTokenExpired = await this.accessTokensService.hasTokenExpired(
        decodedToken,
      );

      if (isTokenExpired) {
        return next(new WsException('UnauthorizedException'));
      }

      // Check user exists
      const user = await this.usersService.findById(decodedToken.sub);

      if (!user) {
        return next(new WsException('UnauthorizedException'));
      }
      socket['userId'] = String(user.id);
      socket['user'] = user;
      next();
    });

    return io;
  }
}
