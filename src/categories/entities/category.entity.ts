import { BaseEntity } from '@/common/base.entity';
import { PostEntity } from '@/posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @OneToMany(() => PostEntity, (p) => p.category)
  posts: PostEntity[];
}
