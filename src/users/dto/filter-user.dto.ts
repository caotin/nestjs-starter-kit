import { BaseFilterDto } from '@/common/base-filter.dto';
import { OrderType } from '@enums/order';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { UserEntity } from '../entites/user.entity';

class OrderDto {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[name]' })
  @IsEnum(OrderType)
  name?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[username]' })
  @IsEnum(OrderType)
  username?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[createdAt]' })
  @IsEnum(OrderType)
  createdAt?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
  @IsEnum(OrderType)
  updatedAt?: OrderType;
}

export class FilterUserDto extends BaseFilterDto<UserEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: OrderDto;
}
