import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Users } from '../../users/entities/user.entity';

@Entity()
export class AccessTokens {
  public static REVOKE_TOKEN = 1;

  constructor(id?: string) {
    this.id = id;
  }

  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: Users;

  @Column({ type: 'boolean', default: false })
  revoked: number;

  @Column({ default: null })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @CreateDateColumn()
  updatedAt!: Date;
}
