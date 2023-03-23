import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagEntity } from './entities/tag.entity';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiResponse({ type: TagEntity })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: TagEntity })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }
}
