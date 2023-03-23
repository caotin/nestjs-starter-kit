import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { FavoriteUserEntity } from './entities/favorite-user.entity';
import { CategoryEntity } from '@/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, FavoriteUserEntity, CategoryEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
