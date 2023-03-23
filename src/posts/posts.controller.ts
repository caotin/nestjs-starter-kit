import { PaginationBase } from '@/common/base.service';
import { UserEntity } from '@/users/entites/user.entity';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { RemovePostDto } from './dto/remove-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth()
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
  @ApiResponse({
    type: PostEntity,
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  @ApiResponse({
    type: PostEntity,
  })
  update(
    @Param() param: RemovePostDto,
    @Body() updatePostDto: UpdatePostDto,
    @User('id') userId: number,
  ) {
    return this.postsService.updatePost(+param.id, updatePostDto, userId);
  }

  @Auth()
  @Delete(':id')
  remove(@Param() removeDto: RemovePostDto, @User('id') userId: number) {
    return this.postsService.removePost(+removeDto.id, userId);
  }
}
