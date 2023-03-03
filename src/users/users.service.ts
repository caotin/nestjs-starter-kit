import { BaseService, Pagination } from '@/common/base.service';
import { MessageName } from '@/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountEntity } from './entities/accounts';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserProfilesEntity } from './entities/user-profiles';
import { NotFoundError, async } from 'rxjs';
import { UserProfileService } from './user-profile.service';
import { MESSAGES } from '@nestjs/core/constants';
import { BalanceHistoriesService } from '@/balance-histories/balance-histories.service';

@Injectable()
export class UsersService extends BaseService<
  AccountEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    private userProfileService: UserProfileService,
    private balanceService: BalanceHistoriesService,
  ) {
    super(MessageName.USER, accountRepository);
  }

  async createAccountWithTransaction<T>(
    createUserDto: T,
    manager: EntityManager,
  ) {
    return await manager.save(AccountEntity, createUserDto);
  }

  async createAccount<T>(createUserDto: T): Promise<AccountEntity> {
    return await this.accountRepository.save(createUserDto);
  }

  async createAccountWithInfor(
    createUserDto: CreateUserDto,
    entityManager: EntityManager,
  ) {
    return await entityManager.create(AccountEntity, createUserDto);
  }

  async findAll(
    filterUserDto: FilterUserDto,
  ): Promise<Pagination<AccountEntity>> {
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
    return await this.accountRepository.findOneBy({ email });
  }

  async searchUserByNameAndEmail(
    conditionText: string,
    filterUserDto: FilterUserDto,
  ): Promise<Pagination<AccountEntity>> {
    const queryBuilder = this.accountRepository
      .createQueryBuilder('acc')
      .select(['acc.*', 'pr.*'])
      .innerJoin(UserProfilesEntity, 'pr', 'acc.id = pr.accountId')
      .where('LOWER(acc.name) LIKE :keyword OR acc.email LIKE :keyword', {
        keyword: `%${conditionText.toLowerCase()}%`,
      })
      .take(filterUserDto.limit)
      .skip(filterUserDto.skip);

    if (filterUserDto.order != undefined) {
      const orderKeys = Object.keys(filterUserDto.order);
      orderKeys.forEach((key) => {
        const sortOrder = filterUserDto.order[key];
        queryBuilder.orderBy(`acc.${key}`, sortOrder);
      });
    }

    const accounts = await queryBuilder.getRawMany();

    if (!accounts) throw new NotFoundException(MessageName.USER);

    return {
      data: accounts,
      total: accounts.length,
    };
  }

  async getProfileUser(accountId: number) {
    const accountPromise = this.accountRepository.findOneBy({ id: accountId });
    const userInforPromise =
      this.userProfileService.findProfileByAccountId(accountId);

    const [account, userInfor] = await Promise.all([
      accountPromise,
      userInforPromise,
    ]);

    return {
      ...account,
      ...userInfor,
    };
  }
}
