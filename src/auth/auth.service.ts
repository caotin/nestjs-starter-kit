import { JWT_TYPE } from '@/common/constants/jwt.type';
import { MessageName } from '@/message';
import { AccessDeniedException } from '@exceptions/access-denied.exception';
import { ExistsException } from '@exceptions/exists.exeption';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { NotFoundException } from '@exceptions/not-found.exception';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {
  CreateAuthDto,
  CreateFacebookAccount,
  CreateGoogleAccount,
} from './dto/auth.dto';
import { StripeService } from '@/stripe/stripe.service';
import { CreateCustomerDto } from '@/stripe/dto/create-customer.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { TransactionManager } from '@/common/transaction-manager';
import { EntityManager } from 'typeorm';
import { UserProfileService } from '@/users/user-profile.service';
import { BalanceHistoriesService } from '@/balance-histories/balance-histories.service';
import { CreateBalanceDto } from '@/balance-histories/dto/create-balance.dto';
import { StatusType } from '@enums/status';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private stripeService: StripeService,
    private transactionManager: TransactionManager,
    private userProfileService: UserProfileService,
    private balanceHistoriesService: BalanceHistoriesService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    let newAccount;

    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new ExistsException(MessageName.USER);
    }

    await this.transactionManager.transaction(
      async (entityManager: EntityManager) => {
        const customerStripe = await this.stripeService.createrCustomer({
          email: createUserDto.email,
          name: createUserDto.name,
          description: `Create account customer stripe of ${createUserDto.email}`,
        } as CreateCustomerDto);

        const hash = this.hashData(createUserDto.password.trim());

        newAccount = await this.usersService.createAccountWithTransaction(
          {
            ...createUserDto,
            password: hash,
            token_stripe: customerStripe.id,
          },
          entityManager,
        );

        await this.userProfileService.createWithTransaction(
          {
            account: newAccount,
          },
          entityManager,
        );

        await this.createBalanceAfterSignup(newAccount, entityManager);
      },
    );

    const tokens = await this.getTokens(newAccount.id, newAccount.email);
    await this.updateRefreshToken(newAccount.id, tokens.refreshToken);

    return {
      ...tokens,
      account: { ...newAccount },
    };
  }

  async signIn(data: CreateAuthDto) {
    const account = await this.usersService.findByEmail(data.email);

    if (!account) throw new NotFoundException(MessageName.USER);

    const passwordMatches = account.comparePassword(data.password);
    if (!passwordMatches) throw new IncorrectException(MessageName.USER);

    const tokens = await this.getTokens(account.id, account.email);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      ...tokens,
      account,
    };
  }

  async googleLogin(userGG: CreateGoogleAccount) {
    const { email, name } = userGG;
    let account: AccountEntity = await this.usersService.findByEmail(email);

    if (!account) {
      await this.transactionManager.transaction(
        async (entityManager: EntityManager) => {
          const customerStripe = await this.stripeService.createrCustomer({
            description: `Create account customer stripe of ${email}`,
            email,
            name,
          });

          account = await this.usersService.createAccountWithTransaction(
            {
              ...userGG,
              token_stripe: customerStripe.id,
            },
            entityManager,
          );

          await this.userProfileService.createWithTransaction(
            {
              account: account,
            },
            entityManager,
          );

          await this.createBalanceAfterSignup(account, entityManager);
        },
      );
    }

    const tokens = await this.getTokens(account.id, account.email);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      ...tokens,
      account,
    };
  }

  async facebookLogin(userFB: CreateFacebookAccount) {
    const { email, name } = userFB;
    let account: AccountEntity = await this.usersService.findByEmail(email);
    if (!account) {
      await this.transactionManager.transaction(
        async (entityManager: EntityManager) => {
          const customerStripe = await this.stripeService.createrCustomer({
            description: `Create account customer stripe of ${email}`,
            email,
            name,
          });

          account = await this.usersService.createAccountWithTransaction(
            {
              ...userFB,
              token_stripe: customerStripe.id,
            },
            entityManager,
          );

          await this.userProfileService.createWithTransaction(
            {
              account: account,
            },
            entityManager,
          );

          await this.createBalanceAfterSignup(account, entityManager);
        },
      );
    }

    const tokens = await this.getTokens(account.id, account.email);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      ...tokens,
      account,
    };
  }

  async createBalanceAfterSignup(
    account: AccountEntity,
    entityManager: EntityManager,
  ) {
    return await this.balanceHistoriesService.createWithTransaction(
      {
        account: account,
        status: StatusType.COMPLETED,
        value: '0',
      } as CreateBalanceDto,
      entityManager,
    );
  }

  async logout(userId: number) {
    this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) throw new AccessDeniedException();

    const refreshTokenMatches = bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new AccessDeniedException();

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hashSync(data, 10);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>(JWT_TYPE.JWT_ACCESS_SECRET),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>(JWT_TYPE.JWT_REFRESH_SECRET),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
