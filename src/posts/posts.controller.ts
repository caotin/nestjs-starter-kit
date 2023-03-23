import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { Pagination, PaginationBase } from '@/common/base.service';
import { PostEntity } from './entities/post.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { User } from '@decorators/user.decorator';
import { UserEntity } from '@/users/entites/user.entity';
import { RemovePostDto } from './dto/remove-post.dto';

@ApiBearerAuth()
@ApiTags('posts')
@Auth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @User() user: UserEntity) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Get()
  @ApiResponse({
    type: PaginationBase<PostEntity>,
  })
  findAll(@Query() filterDto: FilterPostDto) {
    return this.postsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param() param: RemovePostDto, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(param.id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param() removeDto: RemovePostDto) {
    return this.postsService.remove(removeDto.id);
  }
}
