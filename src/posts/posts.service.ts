import { CategoryEntity } from '@/categories/entities/category.entity';
import {
  BaseService,
  PaginationBase,
  RemoveResult,
} from '@/common/base.service';
import { slugify } from '@/common/utils';
import { MessageName } from '@/message';
import { UserEntity } from '@/users/entites/user.entity';
import { NotFoundException } from '@exceptions/not-found.exception';
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
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {
    super(MessageName.POST, postRepository);
  }

  async createPost(dto: CreatePostDto, user: UserEntity): Promise<PostEntity> {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: dto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(MessageName.CATEGORY);
      }
      const post = {
        title: dto.title,
        category: category,
        description: dto.description,
        owner: user,
        region: dto.region,
        slug: slugify(
          dto.title + '-' + Math.random().toString().substring(5, 10),
        ),
        imageUrl: dto.imageUrl,
      } as PostEntity;
      return this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updatePost(
    id: number,
    updateDto: UpdatePostDto,
    userId: number,
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!post) {
      throw new NotFoundException(MessageName.POST);
    }
    const category = await this.categoryRepository.findOneBy({
      id: updateDto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(MessageName.CATEGORY);
    }
    const updated = Object.assign(post, updateDto);
    return this.postRepository.save(updated);
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

  async removePost(id: number, userId: number): Promise<RemoveResult> {
    const post = await this.postRepository.findOne({
      where: { id, owner: { id: userId } },
      select: ['id'],
    });
    if (!post) {
      throw new NotFoundException(MessageName.POST);
    }
    const removed = await this.postRepository.softDelete(id);
    return {
      removed: removed.affected,
    };
  }
}
