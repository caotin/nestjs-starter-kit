import { BaseEntity } from '@/common/base.entity';
import { UserEntity } from '@/users/entites/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('favorite-user')
export class FavoriteUserEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.favorites)
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.favorites)
  post: UserEntity;
}
