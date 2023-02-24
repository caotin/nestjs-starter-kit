import { BaseEntity } from '@/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user_profiles')
export class UserProfilesEntity extends BaseEntity {
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  gender: boolean; // 0: male, 1: female

  @Column({ nullable: true })
  dob: Date;
}
