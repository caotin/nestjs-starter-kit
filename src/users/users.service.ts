import { BaseService, Pagination } from '@/common/base.service';
import { MessageName } from '@/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountEntity } from './entites/accounts';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserProfilesEntity } from './entites/user-profiles';

@Injectable()
export class UsersService extends BaseService<
  AccountEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserProfilesEntity)
    private userProfilesRepository: Repository<UserProfilesEntity>,
  ) {
    super(MessageName.USER, accountRepository);
  }

  async createUserProfile(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfilesEntity> {
    return await this.userProfilesRepository.save(createUserProfileDto);
  }

  async createWithTransaction(
    createUserDto: CreateUserDto,
    manager: EntityManager,
  ): Promise<AccountEntity> {
    const account = await manager.save(AccountEntity, createUserDto);
    return account;
  }

  async createAccount<T>(createUserDto: T): Promise<AccountEntity> {
    return await this.accountRepository.save(createUserDto);
  }

  async findAll(filterUserDto: FilterUserDto): Promise<Pagination<AccountEntity>> {
    const [data, total] = await this.accountRepository.findAndCount({
      take: filterUserDto.limit,
      skip: filterUserDto.skip,
      order: filterUserDto.order,
    });
    return {
      data,
      total,
    };
  }

  // async findByUsername(username: string): Promise<AccountEntity> {
  //   return this.accountRepository.findOneBy({ username });
  // }

  async findByEmail(email: string): Promise<AccountEntity> {
    return this.accountRepository.findOneBy({ email });
  }
}
