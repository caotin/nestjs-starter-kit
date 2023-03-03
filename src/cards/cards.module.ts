import { Module, forwardRef } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './entities/card';
import { StripeModule } from '@/stripe/stripe.module';
import { StripeService } from '@/stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]), 
    StripeModule
  ],
  controllers: [CardsController],
  providers: [CardsService, StripeService],
  exports: [CardsService],
})
export class CardsModule {}
