import { Expose, Transform, Type } from 'class-transformer';
import { Gender } from 'src/common/constants';
import { dateToTimestamp, isUrlValid } from 'src/common/helper/common.helper';
import { castToStorage } from 'src/common/helper/fileupload.helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';


@Entity()
export class RejectedUser {
  public jti?: string;

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
  rejectedBy!: Users;

  @CreateDateColumn()
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}
