import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import Stripe from 'stripe';
import { STRIPE_TYPE } from '@constants/stripe.type';

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
    return await this.stripe.customers.create(createCustomerDto);
  }
}
