import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProfilesEntity } from './entites/userProfiles';
import { AccountEntity } from './entites/accounts';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfilesEntity, AccountEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
