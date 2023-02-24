import { BaseEntity } from '@/common/base.entity';
import { IsEmail } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfilesEntity } from './user-profiles';

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  pin: string;

  @Column()
  token_stripe: string;

  @Column({ nullable: true })
  google_id: string;

  @Column({ nullable: true })
  facebook_id: string;

  @Column({ nullable: true })
  apple_id: string;

  @Column({ nullable: true })
  secret_key_2fa: string;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToOne(() => UserProfilesEntity)
  @JoinColumn()
  user_profile: UserProfilesEntity;

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}