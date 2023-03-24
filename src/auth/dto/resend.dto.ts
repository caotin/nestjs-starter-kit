import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
