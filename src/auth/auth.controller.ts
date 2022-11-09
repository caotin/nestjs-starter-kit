import { UserEntity } from '@/users/entites/user.entity';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Auth } from '@decorators/auth.decorator';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Auth()
  @Get('logout')
  logout(@Req() req: Request & { user: UserEntity }) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request & { user: UserEntity }) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
