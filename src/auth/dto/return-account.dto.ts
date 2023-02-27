import { Expose } from 'class-transformer';

export class ReturnAccountDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  facebook_id: string;

  @Expose()
  google_id: string;

  @Expose()
  apple_id: string;
}
