import { Users } from 'src/api/users/entities/user.entity';
import { DeviceTypes } from 'src/common/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DeviceTokens {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  deviceId: string;

  @Column({
    type: 'enum',
    enum: DeviceTypes,
    default: DeviceTypes.IOS,
  })
  deviceType: DeviceTypes;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user!: Users;
}
