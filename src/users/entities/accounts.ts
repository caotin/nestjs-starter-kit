import { BaseEntity } from '@/common/base.entity';
import { IsEmail } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfilesEntity } from './user-profiles';
import { BankAccountEntity } from '@/bank-accounts/entities/bank-account';
import { CardEntity } from '@/cards/entities/card';
import { LocalBankEntity } from '@/local-banks/entities/local-bank';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { BalanceHistoriesEntity } from '@/balance-histories/entities/balance-history';
import { Exclude } from 'class-transformer';

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  pin: string;

  @Column({ nullable: true })
  @Exclude()
  token_stripe: string;

  @Column({ nullable: true })
  google_id: string;

  @Column({ nullable: true })
  facebook_id: string;

  @Column({ nullable: true })
  apple_id: string;

  @Column({ nullable: true })
  @Exclude()
  secret_key_2fa: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  @OneToMany(() => BankAccountEntity, (bankAccount) => bankAccount.account)
  bank_accounts: BankAccountEntity[];

  @OneToMany(() => CardEntity, (card) => card.account)
  cards: CardEntity[];

  @OneToMany(() => LocalBankEntity, (localBank) => localBank.account)
  local_banks: LocalBankEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.sender)
  transactionSenders: TransactionEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.receiver)
  transactionReceivers: TransactionEntity[];

  @OneToMany(() => BalanceHistoriesEntity, (transaction) => transaction.account)
  balance_histories: BalanceHistoriesEntity[];
}
