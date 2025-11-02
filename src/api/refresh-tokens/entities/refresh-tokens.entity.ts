import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AccessTokens } from '../../access-tokens/entities/access-tokens.entity';

@Entity()
export class RefreshTokens {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => AccessTokens, (accessTokens) => accessTokens.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  accessToken!: AccessTokens;

  @Column({ type: 'boolean', default: false })
  revoked: number;

  @Column({ default: null })
  expiresAt!: Date;
}
