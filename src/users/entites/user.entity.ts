import { BaseEntity } from '@/common/base.entity';
import { Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @ApiProperty()
  refreshToken: string;

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
