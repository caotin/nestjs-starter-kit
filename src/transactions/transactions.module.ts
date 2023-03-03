import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { BalanceHistoriesModule } from '@/balance-histories/balance-histories.module';
import { TransactionManager } from '@/common/transaction-manager';
import { StripeService } from '@/stripe/stripe.service';
import { CardsModule } from '@/cards/cards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    UsersModule,
    BalanceHistoriesModule,
    CardsModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionManager, StripeService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
