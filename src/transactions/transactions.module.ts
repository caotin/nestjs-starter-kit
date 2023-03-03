import { Module, forwardRef } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { BalanceHistoriesModule } from '@/balance-histories/balance-histories.module';
import { TransactionManager } from '@/common/transaction-manager';
import { StripeService } from '@/stripe/stripe.service';
import { StripeModule } from '@/stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    UsersModule,
    BalanceHistoriesModule,
    forwardRef(() => StripeModule)
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionManager],
  exports: [TransactionsService],
})
export class TransactionsModule {}
