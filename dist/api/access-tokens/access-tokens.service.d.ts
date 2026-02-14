import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { AccessTokens } from './entities/access-tokens.entity';
export declare class AccessTokensService {
    private accessTokenRepo;
    private jwtService;
    constructor(accessTokenRepo: Repository<AccessTokens>, jwtService: JwtService);
    findOne(id: any): Promise<AccessTokens>;
    createToken(user: Users): Promise<{
        accessToken: AccessTokens;
        jwtToken: string;
        decodedToken: any;
    }>;
    revokeToken(jwtUniqueIdentifier: string): Promise<void>;
    hasTokenExpired(jwtToken: any): Promise<boolean>;
}
