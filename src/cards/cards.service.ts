import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './entities/card';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dtos/create-card.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { StripeService } from '@/stripe/stripe.service';
import Stripe from 'stripe';
import { NotFoundException } from '@exceptions/not-found.exception';
import { MessageName } from '@/message';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(CardEntity) private cardRepository: Repository<CardEntity>,
        @Inject(forwardRef(() => StripeService))
        private stripeService: StripeService
    ) {
    }


    async findCardMethodById(cardId: number) {
        const cardMethod = await this.cardRepository.findOne({
            where: {
                id: cardId
            }
        });

        if(!cardMethod) {
            throw new NotFoundException(MessageName.CARD);
        }

        return cardMethod
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
