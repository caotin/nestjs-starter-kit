import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { StripeModule } from '@/stripe/stripe.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { FackebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [JwtModule.register({}), UsersModule, StripeModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, FackebookStrategy],
})
export class AuthModule {}
