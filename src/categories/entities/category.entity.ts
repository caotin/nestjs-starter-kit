import { BaseEntity } from '@/common/base.entity';
import { PostEntity } from '@/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => PostEntity, (p) => p.category)
  posts: PostEntity[];
}
