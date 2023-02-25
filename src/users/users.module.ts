import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProfilesEntity } from './entites/user-profiles';
import { AccountEntity } from './entites/accounts';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfilesEntity, AccountEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
