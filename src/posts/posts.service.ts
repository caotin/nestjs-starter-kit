import {
  BaseService,
  PaginationBase,
  RemoveResult,
} from '@/common/base.service';
import { slugify } from '@/common/utils';
import { MessageName } from '@/message';
import { UserEntity } from '@/users/entites/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService extends BaseService<
  PostEntity,
  CreatePostDto,
  UpdatePostDto
> {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {
    super(MessageName.POST, postRepository);
  }

  createPost(
    createPostDto: CreatePostDto,
    user: UserEntity,
  ): Promise<PostEntity> {
    try {
      const post = createPostDto as PostEntity;
      post.slug = slugify(
        createPostDto.title + '-' + Math.random().toString().substring(5, 10),
      );
      post.owner = user;
      return this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(
    filterUserDto: FilterPostDto,
  ): Promise<PaginationBase<PostEntity>> {
    const [data, total] = await this.postRepository.findAndCount({
      take: filterUserDto.limit,
      skip: filterUserDto.skip,
      order: filterUserDto.order,
    });

    return {
      data,
      total,
    };
  }

  findOne(id: string): Promise<PostEntity> {
    return this.postRepository.findOne({
      where: [{ id: +id || undefined }, { slug: id }],
    });
  }

  async remove(id: string | number): Promise<RemoveResult> {
    const removed = await this.postRepository.softDelete(id);
    return {
      removed: removed.affected,
    };
  }
}
