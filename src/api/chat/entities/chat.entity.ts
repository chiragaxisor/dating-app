import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/api/users/entities/user.entity';
import { dateToTimestamp } from 'src/common/helper/common.helper';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  sender!: Users;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  receiver!: Users;

  @Expose()
  receiverUser!: Users;

  @Expose()
  lastMessage: string;

  @Expose()
  messageType: string;

  @Expose()
  unReadMessageCount: number;

  @Expose()
  lastMessageAt: number;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt!: Date;
}
