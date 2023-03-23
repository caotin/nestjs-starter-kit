import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class RemovePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  id: string;
}
