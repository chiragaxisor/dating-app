import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { Expose, Transform } from 'class-transformer';
import { Users } from 'src/api/users/entities/user.entity';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import { MessageTypes } from 'src/common/constants';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chat!: Chat;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sender!: Users;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ default: MessageTypes.TEXT, enum: MessageTypes, type: 'enum' })
  messageType: MessageTypes;

  @Column({ default: false })
  isSeen: boolean;

  @Column({ default: false })
  isDeletedBySender: boolean;

  @Column({ default: false })
  isDeletedByReciever: boolean;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @UpdateDateColumn()
  updatedAt!: Date;
}
