import { BaseEntity } from '@/common/base.entity';
import { PostEntity } from '@/posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('tag')
export class TagEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @ManyToMany(() => PostEntity, (tag) => tag.tags)
  posts: PostEntity[];
}
