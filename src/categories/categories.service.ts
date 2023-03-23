import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
  }
}
