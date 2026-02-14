import { AccessTokens } from '../../access-tokens/entities/access-tokens.entity';
export declare class RefreshTokens {
    id: string;
    accessToken: AccessTokens;
    revoked: number;
    expiresAt: Date;
}
