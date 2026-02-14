import { Repository } from 'typeorm';
import { RefreshTokens } from './entities/refresh-tokens.entity';
export declare class RefreshTokensService {
    private refreshTokenRepo;
    constructor(refreshTokenRepo: Repository<RefreshTokens>);
    findOne(id: string): Promise<RefreshTokens>;
    createToken(decodedToken: any): Promise<string>;
    revokeTokenUsingJti(jwtUniqueIdentifier: string): Promise<void>;
}
