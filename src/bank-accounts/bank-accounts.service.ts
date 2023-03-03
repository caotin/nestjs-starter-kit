import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountEntity } from './entities/bank-account';
import { StripeService } from '@/stripe/stripe.service';
import { CreateBankPaymentMethodDto } from './dtos/create-bank.dto';
import { AccountEntity } from '@/users/entities/accounts';

@Injectable()
export class BankAccountsService {
    constructor(
        @InjectRepository(BankAccountEntity) private bankAccountRepository: Repository<BankAccountEntity>,
        private stripeService: StripeService
    ) {}

    async createBankPyamentMethod(createBankPaymentDto: CreateBankPaymentMethodDto, account: AccountEntity) {
        const { token_stripe } = account;
        
        const paymentMethods = await this.stripeService.createBankPayment(createBankPaymentDto);
        const attachPaymentToAccount = await this.stripeService.attachPaymentToAccount(paymentMethods, token_stripe);
        
        return this.bankAccountRepository.save({
            token: attachPaymentToAccount.id,
            holder_name: createBankPaymentDto.accountHolderName,
            holder_type: attachPaymentToAccount.us_bank_account.account_holder_type,
            bank_name: attachPaymentToAccount.us_bank_account.bank_name,
            currency: createBankPaymentDto.currency,
            country: createBankPaymentDto.country,
            code_last4: attachPaymentToAccount.us_bank_account.last4,
            account  
        });
    }
}
