import { GenderType } from '@enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateUserProfileDto {
  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsBoolean() // 0: male, 1:female
  gender: GenderType;

  @ApiProperty()
  @IsDate()
  dob: Date;
}
