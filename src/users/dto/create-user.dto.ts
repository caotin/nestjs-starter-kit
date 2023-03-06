import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^\S*$/, { message: 'Must not contain whitespace' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(35)
  @MinLength(5)
  @Matches(/^\S*$/, { message: 'Must not contain whitespace' })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'At least one upper case' })
  @Matches(/[a-z]/, { message: 'At least one lower case' })
  @Matches(/[0-9]/, { message: 'At least one digit' })
  @Matches(/[^\w\s]/g, { message: 'At least one special character' })
  @Matches(/^\S*$/, { message: 'Must not contain whitespace' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
    message: 'Must not contain Vietnamese characters',
  })
  password: string;

  refreshToken?: string;

  token_stripe?: string;
}
