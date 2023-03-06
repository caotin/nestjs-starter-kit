import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateTransferDto {
  from?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  to: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @Min(0)
  amount: string;

  @ApiProperty()
  @IsString()
  notes: string;
}
