import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserEntity } from '@/users/entites/user.entity';
import { User } from '@decorators/user.decorator';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthPayload } from './auth.type';
import { AuthDto } from './dto/auth.dto';
import { ResendDto } from './dto/resend.dto';
import { VerifyDto } from './dto/verify.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  signup(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.authService.signUp(createUserDto);
  }

  @Get('resend')
  resend(@Query() resendDto: ResendDto) {
    return this.authService.resend(resendDto.email);
  }

  @Get('verify')
  verify(@Query() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto.token);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: AuthPayload,
  })
  signin(@Body() data: AuthDto): Promise<AuthPayload> {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@User() user: UserEntity) {
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(user.id, refreshToken);
  }
}
