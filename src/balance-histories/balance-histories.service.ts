import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { BalanceHistoriesEntity } from './entities/balance-history';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class BalanceHistoriesService extends BaseService<
  BalanceHistoriesEntity,
  CreateBalanceDto,
  UpdateBalanceDto
> {
  findAll(
    filterDto?: any,
  ): Promise<BalanceHistoriesEntity[] | Pagination<BalanceHistoriesEntity>> {
    throw new Error('Method not implemented.');
  }
}
