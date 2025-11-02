import { Expose, Transform, Type } from 'class-transformer';
import { Gender } from 'src/common/constants';
import { dateToTimestamp, isUrlValid } from 'src/common/helper/common.helper';
import { castToStorage } from 'src/common/helper/fileupload.helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AuthTokenResource {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  expiresAt: number;
}

@Entity()
export class Users {
  public jti?: string;

  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  @Expose()
  @Transform(({ value }) => Number(value))
  id: number;

  @Column()
  @Expose()
  userUniqueId: string;

  @Column({ nullable: true })
  @Expose()
  name: string;

  @Column()
  @Expose()
  email: string;

  @Column({ nullable: true })
  password: string;

  // @Column({ nullable: true })
  // @Expose()
  // countryCode: string;

  // @Column({ nullable: true })
  // @Expose()
  // phone: string;

  @Column({ nullable: true, type: 'text' })
  @Expose()
  address: string;

  @Column({ nullable: true })
  @Expose()
  country: string;

  @Column({ nullable: true })
  @Expose()
  city: string;

  @Column({ nullable: true })
  @Expose()
  state: string;

  // @Column({ nullable: true })
  // @Expose()
  // postalCode: string;

  // @Column({ nullable: true })
  // @Expose()
  // age: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ nullable: true, default: null })
  @Expose()
  @Transform(({ value }) => (isUrlValid(value) ? value : castToStorage(value)))
  profilePic: string;

  @Column({
    type: 'tinyint',
    default: 1,
  })
  @Expose()
  isNotificationOn: boolean;

  // @Column({
  //   default: null,
  // })
  // providerId: string;

  // @Column({
  //   default: null,
  // })
  // providerType: string;

  @Column({
    default: null,
  })
  forgotPasswordCode: string;

  @Column({
    default: null,
  })
  forgotPasswordCodeExpiredAt: Date;

  // @Column({
  //   type: 'tinyint',
  //   default: 0,
  // })
  // @Expose()
  // isSocialLoggedIn: boolean;

  // @Expose()
  // @Column({
  //   type: 'tinyint',
  //   default: 1,
  // })
  // isFirstTimeUser: boolean;

  @Expose()
  @Column({
    type: 'tinyint',
    default: 0,
  })
  isBlocked: boolean;

  @CreateDateColumn()
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  @Transform(({ value }) => dateToTimestamp(value))
  dateOfBirth: Date;
  
  @Column({ nullable: true, type: 'text' })
  @Expose()
  imlooking: string;
  
  @Column({ nullable: true, type: 'text' })
  @Expose()
  relationship: string;
  
  @Column({ nullable: true, type: 'text' })
  @Expose()
  about: string;
  
  @Column({ nullable: true, type: 'text' })
  @Expose()
  interested: string;


  @Expose()
  @Type(() => AuthTokenResource)
  authentication: AuthTokenResource;
}
