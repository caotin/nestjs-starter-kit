import { BankAccountEntity } from '@/bank-accounts/entities/bank-account';
import { CardEntity } from '@/cards/entities/card';
import { LocalBankEntity } from '@/local-banks/entities/local-bank';
import { AccountEntity } from '@/users/entities/accounts';
import { IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  amount: string;

  @IsString()
  status: string;

  @IsString()
  type_transaction: string;

  notes?: string;

  sender: AccountEntity;

  receiver?: AccountEntity;

  bank_account?: BankAccountEntity;

  card?: CardEntity;

  local_bank?: LocalBankEntity;
}
