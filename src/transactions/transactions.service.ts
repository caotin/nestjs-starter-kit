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
  }
}
