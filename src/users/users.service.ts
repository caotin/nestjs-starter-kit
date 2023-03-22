import { BaseService, Pagination } from '@/common/base.service';
import { MessageName } from '@/message';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entites/user.entity';

@Injectable()
export class UsersService extends BaseService<
  UserEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(MessageName.USER, userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(filterUserDto: FilterUserDto): Promise<Pagination<UserEntity>> {
    const [data, total] = await this.userRepository.findAndCount({
      take: filterUserDto.limit,
      skip: filterUserDto.skip,
      order: filterUserDto.order,
    });

    return {
      data,
      total,
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ email });
  }
}
