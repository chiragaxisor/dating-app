import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import { GroupChatMessage } from './group-chat-message.entity';
import { GroupChatMember } from './group-chat-member.entity';

@Entity()
export class GroupChat {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  gender: string; // 'Male', 'Female', etc.

  @OneToMany(() => GroupChatMessage, (message) => message.groupChat)
  messages: GroupChatMessage[];

  @OneToMany(() => GroupChatMember, (member) => member.groupChat)
  members: GroupChatMember[];

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt!: Date;
}
