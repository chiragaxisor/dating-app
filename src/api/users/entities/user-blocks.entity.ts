import { Exclude, Expose, Transform } from 'class-transformer';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/api/users/entities/user.entity';

@Entity()
export class UserBlocks {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => Users, (users) => users.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  user: Users;

  @ManyToOne(() => Users, (users) => users.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  blockedUser: Users;

  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  @CreateDateColumn()
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt!: Date;
}
