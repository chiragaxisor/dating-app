import { Expose, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import { Users } from 'src/api/users/entities/user.entity';

export enum TransactionType {
  PURCHASE = 'purchase',
  SPENT = 'spent',
}

@Entity()
export class CoinHistory {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @Expose()
  user: Users;

  @Column({ type: 'int' })
  @Expose()
  coins: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  @Expose()
  type: TransactionType;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({ nullable: true })
  @Expose()
  productId: string;

  @Column({ nullable: true })
  @Expose()
  transactionId: string;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;
}
