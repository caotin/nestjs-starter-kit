import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { TransactionsService } from './transactions.service';

@ApiBearerAuth()
@ApiTags('transactions')
@Auth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  transfer(
    @Body() createTransferDto: CreateTransferDto,
    @User() account: AccountEntity,
  ) {
    createTransferDto.from = account.id;
    return this.transactionsService.transfer(createTransferDto);
  }
}
