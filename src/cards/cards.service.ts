import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './entities/card';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dtos/create-card.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { StripeService } from '@/stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(CardEntity) private cardRepository: Repository<CardEntity>,
        private stripeService: StripeService
    ) {
    }


    async createCardPayment(createCardDto: CreateCardDto, account: AccountEntity) {
        const { token_stripe } = account;

        const paymentMethod: Stripe.PaymentMethod = await this.stripeService.createCardPayment(createCardDto);

        const attachPaymentToAccount = await this.stripeService.attachPaymentToAccount(paymentMethod, token_stripe);
        return this.cardRepository.save({
            account,
            token: attachPaymentToAccount.id,
            brand: attachPaymentToAccount.card.brand,
            country: attachPaymentToAccount.card.country,
            code_last4: attachPaymentToAccount.card.last4,
            exp_year: `${attachPaymentToAccount.card.exp_year}`,
            exp_month: `${attachPaymentToAccount.card.exp_month}`
        });

    }
}
