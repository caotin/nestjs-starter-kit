import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('bank_accounts')
export class BankAccountEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  holder_name: string;

  @Column()
  holder_type: string;

  @Column()
  bank_name: string;

  @Column()
  country: string;

  @Column()
  currency: string;

  @Column()
  code_last4: string;

  @Column()
  routing_name: string;

  @ManyToOne(() => AccountEntity, (account) => account.bank_accounts)
  account: AccountEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.bank_account)
  transactions: TransactionEntity[];
}
