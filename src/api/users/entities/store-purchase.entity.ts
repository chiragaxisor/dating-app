import { Expose, Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { dateToTimestamp } from 'src/common/helper/common.helper';
import { Users } from './user.entity';

export enum PurchaseType {
  COIN = 'coin',
  SUBSCRIPTION = 'subscription',
}

export enum PurchaseStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum PlatformType {
  ANDROID = 'android',
  IOS = 'ios',
}

@Entity()
export class StorePurchase {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @Expose()
  user: Users;

  @Column()
  @Expose()
  productId: string;

  @Column({
    type: 'enum',
    enum: PurchaseType,
  })
  @Expose()
  purchaseType: PurchaseType;

  @Column({
    type: 'enum',
    enum: PlatformType,
  })
  @Expose()
  platform: PlatformType;

  @Column({ nullable: true })
  @Expose()
  transactionId: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  purchaseToken: string;

  @Column({ nullable: true })
  @Expose()
  packageName: string;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.COMPLETED,
  })
  @Expose()
  status: PurchaseStatus;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  expiryDate: Date;

  @Transform(({ value }) => dateToTimestamp(value))
  @Expose()
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
