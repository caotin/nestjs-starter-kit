import { Auth } from '@decorators/auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BalanceHistoriesService } from './balance-histories.service';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';

@ApiBearerAuth()
@ApiTags('balance')
@Auth()
@Controller('balance')
export class BalanceHistoriesController {
  constructor(private readonly balanceService: BalanceHistoriesService) {}

  @Get()
  getBalanceLatestMe(@User() account: AccountEntity) {
    return this.balanceService.getBalanceLatest(account.id);
  }
}
