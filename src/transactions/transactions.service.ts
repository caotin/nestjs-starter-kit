import { BaseService, Pagination } from '@/common/base.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { TransactionEntity } from './entities/transaction';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UsersService } from '@/users/users.service';
import { MessageName } from '@/message';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepositoryMetadataArgs } from 'typeorm/metadata-args/TransactionRepositoryMetadataArgs';
import { EntityManager, Repository } from 'typeorm';
import { BalanceHistoriesService } from '@/balance-histories/balance-histories.service';
import { NotFoundException } from '@exceptions/not-found.exception';
import { TransactionManager } from '@/common/transaction-manager';
import { TransactionType } from '@enums/transaction';
import { StatusType } from '@enums/status';
import { DepositWithCardDto } from './dto/deposit-transaction.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { CardsService } from '@/cards/cards.service';
import { StripeService } from '@/stripe/stripe.service';
import { Currency } from '@constants/currency';
import { BalanceHistoriesEntity } from '@/balance-histories/entities/balance-history';

@Injectable()
export class TransactionsService extends BaseService<
  TransactionEntity,
  CreateTransactionDto,
  UpdateTransactionDto
> {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly usersService: UsersService,
    private readonly balanceService: BalanceHistoriesService,
    private readonly transactionManager: TransactionManager,
    private readonly cardService: CardsService,
    private readonly stripeService: StripeService
  ) {
    super(MessageName.USER, transactionRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<TransactionEntity[] | Pagination<TransactionEntity>> {
    throw new Error('Method not implemented.');
  }

  async transfer(createTransferDto: CreateTransferDto) {
    let newtransaction: TransactionEntity;

    // check balance sender enough
    const checkBalanceEnough = await this.balanceService.checkBalanceEnough(
      createTransferDto.from,
      createTransferDto.amount,
    );

    if (!checkBalanceEnough) {
      throw new ConflictException('You not enough funds to transfer');
    }

    // find user to and user from
    const userToFind = this.usersService.findById(createTransferDto.to);
    const userFromFind = this.usersService.findById(createTransferDto.from);

    const [userTo, userFrom] = await Promise.all([userToFind, userFromFind]);

    if (!userTo) {
      throw new NotFoundException(
        `Not found user with id ${createTransferDto.to}` as MessageName.USER,
      );
    }

    //  get balance and update balance value
    const balanceTo = this.balanceService.getBalanceLatest(
      createTransferDto.to,
    );

    const balanceFrom = this.balanceService.getBalanceLatest(
      createTransferDto.from,
    );

    const [rsBalanceTo, rsBalanceFrom] = await Promise.all([
      balanceTo,
      balanceFrom,
    ]);

    if (!rsBalanceFrom || !rsBalanceTo) {
      throw new ConflictException('Error get balance');
    }

    const newBalanceTo = +rsBalanceTo.value + +createTransferDto.amount;
    const newBalanceFrom = +rsBalanceFrom.value - +createTransferDto.amount;

    await this.transactionManager.transaction(
      async (entityManager: EntityManager) => {
        const transactionModel: CreateTransactionDto = {
          amount: createTransferDto.amount,
          sender: userFrom,
          receiver: userTo,
          status: StatusType.COMPLETED,
          type_transaction: TransactionType.TRANSFER,
          notes: createTransferDto.notes,
        };

        newtransaction = await entityManager.save(
          TransactionEntity,
          transactionModel,
        );

        const createBalanceTo = this.balanceService.createWithTransaction(
          {
            status: StatusType.COMPLETED,
            transaction: newtransaction,
            account: userTo,
            value: newBalanceTo.toString(),
          },
          entityManager,
        );

        const createBalanceFrom = this.balanceService.createWithTransaction(
          {
            status: StatusType.COMPLETED,
            transaction: newtransaction,
            account: userFrom,
            value: newBalanceFrom.toString(),
          },
          entityManager,
        );

        await Promise.all([createBalanceTo, createBalanceFrom]);
      },
    );

    delete newtransaction.sender;
    delete newtransaction.receiver;

    return {
      ...newtransaction,
      ...createTransferDto,
    };
    // return '';
  }

  async deposit(depositWithCardDto: DepositWithCardDto, account: AccountEntity){
    const { amount, cardId } = depositWithCardDto;
    const { token_stripe } = account

    const cardPaymentMethod = await this.cardService.findCardMethodById(cardId);
    let paymenIntent;

    let transaction: TransactionEntity;
    await this.transactionManager.transaction(
      async (entityManager: EntityManager) => {
        transaction = this.transactionRepository.create();
        transaction.amount = String(amount);
        transaction.status = StatusType.PENDING;
        transaction.type_transaction = TransactionType.DEPOSIT;
        transaction.notes = `Deposit to app with amount: ${amount}`;
        transaction.card = cardPaymentMethod;
    
        const latestBalanceHistory = await this.balanceService.getBalanceLatest(account.id);
        const balance = latestBalanceHistory.value + amount;
        await this.balanceService.createWithTransaction(
          {
            account: account,
            status: StatusType.PENDING,
            value: String(balance),
            transaction: transaction
          },
          entityManager
        );
        
        await this.transactionRepository.save(transaction);

        paymenIntent = await this.stripeService.createPaymentIntent(amount, Currency.USD, cardPaymentMethod.token, token_stripe, transaction.id);
      }
    );

    return {
      client_secret: paymenIntent.client_secret,
      transaction,
    }
  }

  async handleDepositComplete(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
    if(transaction.status !== StatusType.PENDING) {
      throw new Error("have wrong in handle deposit complete");
    }

    transaction.status = StatusType.COMPLETED;
    await this.transactionRepository.save(transaction);
    const balanceHistory = await this.balanceService.findBalanceHistoryByTransaction(transaction);
    balanceHistory.status = StatusType.COMPLETED
    await this.balanceService.saveBalanceHistory(balanceHistory);
  }

  async handleDepositFail(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
    transaction.status = StatusType.COMPLETED;
    await this.transactionRepository.save(transaction);
    const balanceHistory = await this.balanceService.findBalanceHistoryByTransaction(transaction);
    await this.balanceService.removeBalanceHistory(balanceHistory);
  }
}
