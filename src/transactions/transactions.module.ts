import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { BalanceHistoriesModule } from '@/balance-histories/balance-histories.module';
import { TransactionManager } from '@/common/transaction-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    UsersModule,
    BalanceHistoriesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionManager],
  exports: [TransactionsService],
})
export class TransactionsModule {}
