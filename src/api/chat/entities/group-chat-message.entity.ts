import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { Users } from 'src/api/users/entities/user.entity';
import { GroupChat } from './group-chat.entity';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import { MessageTypes } from 'src/common/constants';

@Entity()
export class GroupChatMessage {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  groupChat!: GroupChat;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sender!: Users;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ default: MessageTypes.TEXT, enum: MessageTypes, type: 'enum' })
  messageType: MessageTypes;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @UpdateDateColumn()
  updatedAt!: Date;
}
