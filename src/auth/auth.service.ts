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
import { CreateAuthDto, CreateFacebookAccount, CreateGoogleAccount } from './dto/auth.dto';
import { StripeService } from '@/stripe/stripe.service';
import { CreateCustomerDto } from '@/stripe/dto/create-customer.dto';
import Stripe from 'stripe';
import { AccountEntity } from '@/users/entites/accounts';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private stripeService: StripeService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new ExistsException(MessageName.USER);
    }

    // Hash password
    const hash = this.hashData(createUserDto.password);

    // create account stripe
    const customerStripe = await this.stripeService.createrCustomer({
      email: createUserDto.email,
      name: createUserDto.name,
      description: `Create account customer stripe of ${createUserDto.email}`,
    } as CreateCustomerDto);

    if (!customerStripe) {
      throw new IncorrectException(MessageName.USER);
    }

    const newUser = await this.usersService.createAccount({
      ...createUserDto,
      password: hash,
      token_stripe: customerStripe.id,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return {
      ...tokens,
      account: {
        ...newUser,
        refreshToken: newUser.refreshToken,
      },
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

  /**
   * This function creates a customer in Stripe and returns the customer object.
   * @param {string} email - string, name: string
   * @param {string} name - The name of the customer.
   * @returns A promise of a Stripe.Customer
   */
  async createCustomerStripe(email: string, name: string): Promise<Stripe.Customer> {
    const customerStripe: Stripe.Customer = await this.stripeService.createrCustomer({
      email,
      name,
      description: `Create account customer stripe of ${email}`
    });

    return customerStripe;
  }
  
  async googleLogin(userGG: CreateGoogleAccount) {
    const { email, name } = userGG;
    let account: AccountEntity = await this.usersService.findByEmail(email);

    if(!account) {
      const customerStripe = await this.createCustomerStripe(email, name);

      account = await this.usersService.createAccount({
        ...userGG,
        token_stripe: customerStripe.id
      });
    }

    const tokens = await this.getTokens(account.id, account.email);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      ...tokens,
      account
    }
  }

  async facebookLogin(userFB: CreateFacebookAccount) {
    const { email, name } = userFB;
    let account: AccountEntity = await this.usersService.findByEmail(email);
    if(!account) {
      const customerStripe = await this.createCustomerStripe(email, name);

      account = await this.usersService.createAccount({
        ...userFB,
        token_stripe: customerStripe.id
      }); 
    }

    const tokens = await this.getTokens(account.id, account.email);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      ...tokens,
      account
    }
  }

  async logout(userId: number) {
    this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    console.log(userId);

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
    await this.usersService.updateAccount(userId, {
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
