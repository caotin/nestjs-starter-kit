import { Controller, Post, Body } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('cards')
@Auth()
@Controller('cards')
export class CardsController {
    constructor(
        private cardService: CardsService
    ) {}

    @Post()
    async creatCardPayment(@Body() creatCardto: CreateCardDto, @User() account: AccountEntity) {
        return this.cardService.createCardPayment(creatCardto, account);
    }
}
