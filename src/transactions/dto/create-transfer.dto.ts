import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransferDto {
  from?: number;

  @ApiProperty()
  @IsNumber()
  to: number;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty({ nullable: true })
  @IsString()
  notes: string;
}
