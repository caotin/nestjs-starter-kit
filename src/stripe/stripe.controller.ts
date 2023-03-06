import { Controller, Post, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { WebhookEventStripe } from '@constants/webhook-event-stripe';

@Controller('webhook')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService
  ) {}

  @Post()
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    let sig: string | string[] = req.headers['stripe-signature'];

    const rawBody = req.rawBody;

    const event: Stripe.Event = this.stripeService.constructEvent(sig, rawBody.toString());


    let result: any;
    const { id } = event.data.object as Stripe.PaymentIntent;
    const paymenIntent: Stripe.PaymentIntent = await this.stripeService.getPaymentIntent(id);
    switch (event.type) {
        case WebhookEventStripe.PAYMENTSUCCEEDED:
          result = await this.stripeService.handlePaymentIntentSuccess(paymenIntent);
          break;
        
        case WebhookEventStripe.PAYMENTCANCELED:
          result = await this.stripeService.handlePaymentIntentFail(paymenIntent);
          break;
    }


    return result;
  }
}
