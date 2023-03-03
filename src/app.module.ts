import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { config } from '../ormconfig';
import { StripeModule } from './stripe/stripe.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { CardsModule } from './cards/cards.module';
import { LocalBanksModule } from './local-banks/local-banks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BalanceHistoriesModule } from './balance-histories/balance-histories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    StripeModule,
    TransactionsModule,
    CardsModule,
    BankAccountsModule,
    LocalBanksModule,
    BalanceHistoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
