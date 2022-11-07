import { BaseEntity } from '@/common/base.entity';
import { Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
