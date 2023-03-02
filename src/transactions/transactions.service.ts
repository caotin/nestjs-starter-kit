import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { TransactionEntity } from './entities/transaction';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransactionsService extends BaseService<
  TransactionEntity,
  CreateTransactionDto,
  UpdateTransactionDto
> {
  findAll(
    filterDto?: any,
  ): Promise<TransactionEntity[] | Pagination<TransactionEntity>> {
    throw new Error('Method not implemented.');
  }

  async transfer(createTransferDto: CreateTransferDto) {}
}
