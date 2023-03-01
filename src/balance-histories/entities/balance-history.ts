import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('balance_histories')
export class BalanceHistoriesEntity extends BaseEntity {
  @Column()
  value: string;

  @Column()
  status: StatusType;

  @ManyToOne(() => AccountEntity, (account) => account.balance_histories)
  account: AccountEntity;

  @ManyToOne(
    () => TransactionEntity,
    (transaction) => transaction.balance_histories,
  )
  transaction: TransactionEntity;
}
