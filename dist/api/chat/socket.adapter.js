"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const websockets_1 = require("@nestjs/websockets");
class SocketAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app, jwtService, accessTokensService, usersService) {
        super(app);
        this.app = app;
        this.jwtService = jwtService;
        this.accessTokensService = accessTokensService;
        this.usersService = usersService;
    }
    createIOServer(port, options) {
        const io = super.createIOServer(port, options);
        io.use(async (socket, next) => {
            const { token } = socket.handshake.auth;
            if (!token) {
                return next(new websockets_1.WsException('UnauthorizedException'));
            }
            const decodedToken = this.jwtService.decode(token);
            if (!decodedToken) {
                return next(new websockets_1.WsException('UnauthorizedException'));
            }
            const isTokenExpired = await this.accessTokensService.hasTokenExpired(decodedToken);
            if (isTokenExpired) {
                return next(new websockets_1.WsException('UnauthorizedException'));
            }
            const user = await this.usersService.findById(decodedToken.sub);
            if (!user) {
                return next(new websockets_1.WsException('UnauthorizedException'));
            }
            socket['userId'] = String(user.id);
            socket['user'] = user;
            next();
        });
        return io;
    }
}
exports.SocketAdapter = SocketAdapter;
//# sourceMappingURL=socket.adapter.js.map