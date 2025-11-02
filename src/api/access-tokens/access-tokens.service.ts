import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { AccessTokens } from './entities/access-tokens.entity';

@Injectable()
export class AccessTokensService {
  constructor(
    @InjectRepository(AccessTokens)
    private accessTokenRepo: Repository<AccessTokens>,
    private jwtService: JwtService,
  ) {}

  /**
   * Find one access token by id
   * @param id
   */
  findOne(id: any) {
    return this.accessTokenRepo.findOne({ where: { id: id } });
  }

  /**
   * Create JWT token
   * @param user
   * @returns
   */
  async createToken(user: Users) {
    const jwtToken = this.jwtService.sign({
      username: user.email,
      sub: user.id,
      jti: randomBytes(32).toString('hex'),
    });

    const decodedToken = this.jwtService.decode(jwtToken);

    const createdAt = moment.unix(decodedToken['iat']).toDate();
    const expiresAt = moment.unix(decodedToken['exp']).toDate();

    const accessToken = this.accessTokenRepo.create({
      id: decodedToken['jti'],
      expiresAt,
      createdAt,
      user,
    });

    await this.accessTokenRepo.save(accessToken);
    return { accessToken, jwtToken, decodedToken };
  }

  /**
   * Revoke access token using Jwt Unique Identifier
   * @param jwtUniqueIdentifier
   */
  async revokeToken(jwtUniqueIdentifier: string) {
    await this.accessTokenRepo.save({
      id: jwtUniqueIdentifier,
      revoked: 1,
    });
  }

  /**
   * Check JWT Token validity
   * @param jwtToken
   * @return boolean
   */
  async hasTokenExpired(jwtToken: any) {
    const accessToken = await this.findOne(jwtToken['jti']);

    const todaysDate = new Date();

    return !accessToken ||
      accessToken.revoked == AccessTokens.REVOKE_TOKEN ||
      accessToken.expiresAt < todaysDate
      ? true
      : false;
  }
}
