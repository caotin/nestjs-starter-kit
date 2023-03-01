import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('cards')
export class CardEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  brand: string;

  @Column()
  country: string;

  @Column()
  exp_month: string;

  @Column()
  exp_year: string;

  @Column()
  code_last4: string;

  @ManyToOne(() => AccountEntity, (account) => account.cards)
  account: AccountEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.card)
  transactions: TransactionEntity[];
}
