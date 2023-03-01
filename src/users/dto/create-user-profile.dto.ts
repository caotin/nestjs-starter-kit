import { GenderType } from '@enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, ValidateIf } from 'class-validator';
import { AccountEntity } from '../entities/accounts';

export class CreateUserProfileDto {
  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  avatar?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  fullname?: string;

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
  @IsDateString()
  @ValidateIf((object, value) => value !== null)
  dob?: Date;

  account?: AccountEntity;
}
