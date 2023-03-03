import { Expose, Type } from 'class-transformer';
import { ReturnUserProfileDto } from './return-user-profile.dto';

export class ReturnSearchUserDto {
  @Expose()
  @Type(() => ReturnUserProfileDto)
  data: ReturnUserProfileDto[];

  @Expose()
  total: number;
}
