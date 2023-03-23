import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  region: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
