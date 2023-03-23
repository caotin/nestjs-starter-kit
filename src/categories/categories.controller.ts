import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ type: CategoryEntity, isArray: true })
  findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: CategoryEntity })
  findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return this.categoriesService.findOne(+id);
  }
}
