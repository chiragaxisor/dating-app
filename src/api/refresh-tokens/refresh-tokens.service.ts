import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { encrypt } from 'src/common/helper/common.helper';
import { Repository } from 'typeorm';
import { RefreshTokens } from './entities/refresh-tokens.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokens)
    private refreshTokenRepo: Repository<RefreshTokens>,
  ) {}

  /**
   * Find refresh token by id
   * @param id
   * @returns
   */
  async findOne(id: string) {
    return this.refreshTokenRepo.findOne({
      where: { id },
      relations: ['accessToken', 'accessToken.user'],
    });
  }

  /**
   * Create refresh token
   * @param decodedToken
   * @returns
   */
  async createToken(decodedToken: any) {
    const refreshTokenLifeTime = moment
      .unix(decodedToken.exp)
      .add(30, 'd')
      .toDate();

    const refreshToken = randomBytes(64).toString('hex');

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        id: refreshToken,
        accessToken: decodedToken.jti,
        expiresAt: refreshTokenLifeTime,
      }),
    );

    return encrypt(refreshToken);
  }

  /**
   * Revoke refresh token using JTI
   * @param jwtUniqueIdentifier
   */
  async revokeTokenUsingJti(jwtUniqueIdentifier: string) {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { accessToken: { id: jwtUniqueIdentifier } },
    });
    refreshToken.revoked = 1;
    await this.refreshTokenRepo.save(refreshToken);
  }
}
