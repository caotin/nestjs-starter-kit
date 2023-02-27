import { GenderType } from '@enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString, ValidateIf } from 'class-validator';
import { IsNull } from 'typeorm';
import { AccountEntity } from '../entites/accounts';

export class CreateUserProfileDto {
  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  avatar?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  phone?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  address?: string | null;

  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  gender?: GenderType | null;

  @ApiProperty()
  @IsDate()
  @ValidateIf((object, value) => value !== null)
  dob?: Date;

  account?: AccountEntity;
}
