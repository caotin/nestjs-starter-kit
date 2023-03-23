import { CategoryEntity } from '@/categories/entities/category.entity';
import { BaseEntity } from '@/common/base.entity';
import { TagEntity } from '@/tags/entities/tag.entity';
import { UserEntity } from '@/users/entites/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { FavoriteUserEntity } from './favorite-user.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  region: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column('longtext')
  description: string;

  @ApiProperty()
  @Column()
  imageUrl: string;

  @ApiProperty()
  @OneToMany(() => FavoriteUserEntity, (user) => user.post)
  favorites: FavoriteUserEntity[];

  @ManyToOne(() => UserEntity, (user) => user.posts)
  owner: UserEntity;

  @ApiProperty()
  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  tags: TagEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  category: CategoryEntity;
}
