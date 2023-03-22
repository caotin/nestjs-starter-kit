import { UserEntity } from '@/users/entites/user.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthPayload extends PartialType(UserEntity) {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
