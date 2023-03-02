import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { IsString } from 'class-validator';

export class CreateBalanceDto {
  @IsString()
  value: string;

  @IsString()
  status: string;

  account: AccountEntity;

  transaction: TransactionEntity;
}
