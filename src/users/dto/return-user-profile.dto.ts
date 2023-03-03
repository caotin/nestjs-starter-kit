import { GenderType } from '@enums/gender';
import { Expose } from 'class-transformer';

export class ReturnUserProfileDto {
  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  fullname: string;

  @Expose()
  gender: GenderType;

  @Expose()
  phone: string;

  @Expose()
  address: string;

  @Expose()
  dob: Date;
}
