import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountEntity } from './entities/bank-account';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { StripeService } from '@/stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountEntity])],
  controllers: [BankAccountsController],
  providers: [BankAccountsService, StripeService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
