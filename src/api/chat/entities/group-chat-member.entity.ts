import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/api/users/entities/user.entity';
import { GroupChat } from './group-chat.entity';
import { dateToTimestamp } from 'src/common/helper/common.helper';

@Entity()
export class GroupChatMember {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  groupChat!: GroupChat;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  user!: Users;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  joinedAt!: Date;
}
