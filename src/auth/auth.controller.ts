import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  CreateFacebookAccount,
  CreateGoogleAccount,
} from './dto/auth.dto';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnAuthDto } from './dto/return-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('auth')
@Serialize(ReturnAuthDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: CreateAuthDto) {
    return this.authService.signIn(data);
  }

  @Auth()
  @Get('logout')
  logout(@User() user: AccountEntity) {
    this.authService.logout(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@User() user: AccountEntity) {
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(user.id, refreshToken);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: RequestWithUser) {
    return this.authService.googleLogin(req.user as CreateGoogleAccount);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req: Request) {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: RequestWithUser) {
    return this.authService.facebookLogin(req.user as CreateFacebookAccount);
  }
}
