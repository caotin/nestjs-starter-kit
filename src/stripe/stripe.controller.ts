import { Controller, Post, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('webhook')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService
  ) {}

  @Post()
  async handleStripeWebhook(@Req() req) {
    // const event = req.body;
    // let result: any;
    // const { id } = event.data.object;
    // const paymenIntent: Stripe.PaymentIntent = await this.stripeService.getPaymentIntent(id);
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //       result = await this.stripeService.handlePaymentIntentSuccess(paymenIntent);
        
    //     case 'payment_intent.canceled':
    //       result = await this.stripeService.handlePaymentIntentFail(paymenIntent);
    //     default:
    //       return result;
    // }
  }
}
