import { Auth } from '@decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from './entities/accounts';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ReturnUserProfileDto } from './dto/return-user-profile.dto';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnSearchUserDto } from './dto/return-search-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Get('check-email')
  checkEmail(@Query('email') email: string) {
    return this.usersService.checkEmailExist(email);
  }

  @Auth()
  @Get('profile')
  @Serialize(ReturnUserProfileDto)
  getInforUserHomeScreen(@User() account: AccountEntity) {
    return this.usersService.getProfileUser(account.id);
  }

  @Auth()
  @Get('search')
  @Serialize(ReturnSearchUserDto)
  async searchUser(
    @Query('text') text: string,
    @Query() filterUserDto: FilterUserDto,
  ) {
    const data = await this.usersService.searchUserByNameAndEmail(
      text,
      filterUserDto,
    );
    return data;
  }

  @Auth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth()
  @Get()
  findAll(@Query() filterUserDto: FilterUserDto) {
    return this.usersService.findAll(filterUserDto);
  }

  @Auth()
  @Post('user_profile')
  createUserProfile(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @User() account: AccountEntity,
  ) {
    return this.userProfileService.createUserProfile(
      createUserProfileDto,
      account,
    );
  }

  @Auth()
  @Patch('user_profile/:id')
  updateUserProfile(
    @Param('id') id: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.updateUserProfile(id, updateUserProfileDto);
  }

  @Auth()
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
