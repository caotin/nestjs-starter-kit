import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { UserProfilesEntity } from './entites/user-profiles';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageName } from '@/message';

@Injectable()
export class UserProfileService extends BaseService<
  UserProfilesEntity,
  CreateUserProfileDto,
  UpdateUserProfileDto
> {
  constructor(
    @InjectRepository(UserProfilesEntity)
    private userProfilesRepository: Repository<UserProfilesEntity>,
  ) {
    super(MessageName.USER, userProfilesRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<UserProfilesEntity[] | Pagination<UserProfilesEntity>> {
    throw new Error('Method not implemented.');
  }

  async createWithTransaction(
    createDto: CreateUserProfileDto,
    entityManager: EntityManager,
  ): Promise<UserProfilesEntity> {
    return await entityManager.save(UserProfilesEntity, createDto);
  }
}
