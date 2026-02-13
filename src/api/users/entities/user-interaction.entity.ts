import { Expose, Transform } from 'class-transformer';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

export enum InteractionType {
  APPROVE = 'approve',
  REJECT = 'reject',
}

@Entity()
export class UserInteraction {
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
  user!: Users;
  
  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  actionBy!: Users;

  @Column({
    type: 'enum',
    enum: InteractionType,
  })
  @Expose()
  actionType: InteractionType;

  @CreateDateColumn()
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}
