import { BaseFilterDto } from '@/common/base-filter.dto';
import { OrderType } from '@enums/order';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PostEntity } from '../entities/post.entity';

class OrderDto {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[createdAt]' })
  @IsEnum(OrderType)
  createdAt?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
  @IsEnum(OrderType)
  updatedAt?: OrderType;
}

export class FilterPostDto extends BaseFilterDto<PostEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: OrderDto;
}
