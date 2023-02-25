import { BaseService, Pagination } from '@/common/base.service';
import { MessageName } from '@/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async updateAccount(
    id: string | number,
    updateDto: UpdateUserDto,
  ): Promise<AccountEntity> {
    const toUpdate = await this.accountRepository.findOne({
      where: { id } as any,
    });
    if (!toUpdate) {
      throw new NotFoundException(MessageName.USER);
    }
    const updated = Object.assign(toUpdate, updateDto);
    return this.accountRepository.save(updated);
  }
}
