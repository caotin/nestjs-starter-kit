import { Injectable, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import Stripe from 'stripe';
import { STRIPE_TYPE } from '@constants/stripe.type';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { MessageName } from '@/message';
import { CreateCardDto } from '@/cards/dtos/create-card.dto';
import { CreateBankPaymentMethodDto } from '@/bank-accounts/dtos/create-bank.dto';
import { PaymentMethods } from '@enums/paymentMethods';
import { TransactionsService } from '@/transactions/transactions.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly transactionService: TransactionsService,
  ) {
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

  async createCardPayment(createCardDto: CreateCardDto) {
    const { type, cvc, expMonth, expYear, number } = createCardDto;

    const cardPayment = await this.stripe.paymentMethods.create({
      type: type,
      card: {
        number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc
      }
    });

    if (!cardPayment) {
      throw new IncorrectException(MessageName.USER);
    }

    return cardPayment;
  }

  async createBankPayment(createBankPaymentDto: CreateBankPaymentMethodDto) {
    const { accountHolderName, accountHolderType, accountNumber, routingNumber } = createBankPaymentDto;

    const bankPayment = await this.stripe.paymentMethods.create({
      type: PaymentMethods.USBANK,
      us_bank_account: {
        account_holder_type: accountHolderType,
        account_number: accountNumber,
        routing_number: routingNumber,
      },
      billing_details: {
        name: accountHolderName
      }
    });

    if (!bankPayment) {
      throw new IncorrectException(MessageName.USER);
    }

    return bankPayment;
  }

  async attachPaymentToAccount(paymentSource: Stripe.PaymentMethod, customerToken: string) {
    const attachPaymentToAcc = this.stripe.paymentMethods.attach(
      paymentSource.id,
      {
        customer: customerToken
      }
    );

    if (!attachPaymentToAcc) {
      throw new InternalServerErrorException();
    }

    return attachPaymentToAcc;
  }

  async createPaymentIntent(amount: number, currency: string, paymentMethodToken: string, custometToken: string, transactionId: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: custometToken,
      payment_method: paymentMethodToken,
      confirm: true,
      metadata: {
        transactionId: transactionId.toString()
      }
    });

    return paymentIntent;
  }

  async getPaymentIntent(id: string) {
    return this.stripe.paymentIntents.retrieve(
      id
    );
  }

  // async handlePaymentIntentSuccess(paymentIntent: Stripe.PaymentIntent) {
  //   const { transactionId } = paymentIntent.metadata;
  //   await this.transactionService.handleDepositComplete(parseInt(transactionId));
  //   return {
  //     message: "update transaction and balance history success"
  //   }
  // }

  // async handlePaymentIntentFail(paymentIntent: Stripe.PaymentIntent) {
  //   const { transactionId } = paymentIntent.metadata;
  //   await this.transactionService.handleDepositFail(parseInt(transactionId));

  //   return {
  //     message: "update transaction and delete the record balance history success"
  //   }
  // }
}
