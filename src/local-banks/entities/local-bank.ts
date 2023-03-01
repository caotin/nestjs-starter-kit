import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('local_banks')
export class LocalBankEntity extends BaseEntity {
  @Column()
  account_number: string;

  @Column()
  bank_name: string;

  @Column()
  bank_code: string;

  @Column()
  bank_user_name: string;

  @ManyToOne(() => AccountEntity, (account) => account.local_banks)
  account: AccountEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.local_bank)
  transactions: TransactionEntity[];
}
