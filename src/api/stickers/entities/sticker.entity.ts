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

@Entity()
export class Sticker {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column({ default: 'sticker' })
  @Expose()
  type: string; // 'sticker', 'gift', etc.

  @Column({ type: 'text' })
  @Expose()
  url: string;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt!: Date;
}
