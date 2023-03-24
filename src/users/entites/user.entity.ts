import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FavoriteUserEntity } from '@/posts/entities/favorite-user.entity';
import { PostEntity } from '@/posts/entities/post.entity';

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

  @Column({ nullable: true, select: false })
  @ApiProperty()
  @Exclude()
  verifyToken: string;

  @Column({ nullable: true, select: false })
  @ApiProperty()
  @Exclude()
  refreshToken: string;

  @OneToMany(() => FavoriteUserEntity, (user) => user.user)
  favorites: FavoriteUserEntity[];

  @OneToMany(() => PostEntity, (post) => post.owner)
  posts: PostEntity[];

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
