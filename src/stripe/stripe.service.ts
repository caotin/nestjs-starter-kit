import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import Stripe from 'stripe';
import { STRIPE_TYPE } from '@constants/stripe.type';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { MessageName } from '@/message';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get(STRIPE_TYPE.STRIPE_SECRET_KEY),
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  async createrCustomer(createCustomerDto: CreateCustomerDto) {
    const customerStripe = await this.stripe.customers.create(
      createCustomerDto,
    );
    if (!customerStripe) {
      throw new IncorrectException(MessageName.USER);
    }
    return customerStripe;
  }
}
