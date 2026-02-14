import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccessTokensService } from '../access-tokens/access-tokens.service';
export declare class SocketAdapter extends IoAdapter {
    private readonly app;
    private readonly jwtService;
    private readonly accessTokensService;
    private readonly usersService;
    constructor(app: INestApplicationContext, jwtService: JwtService, accessTokensService: AccessTokensService, usersService: UsersService);
    createIOServer(port: number, options: ServerOptions): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}
