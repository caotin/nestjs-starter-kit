import { UserEntity } from '@/users/entites/user.entity';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AuthPayload } from './auth.type';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 200,
    type: AuthPayload,
  })
  signup(@Body() createUserDto: CreateUserDto): Promise<AuthPayload> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: AuthPayload,
  })
  signin(@Body() data: AuthDto): Promise<AuthPayload> {
    return this.authService.signIn(data);
  }

  // @Auth()
  // @Get('logout')
  // logout(@User() user: UserEntity) {
  //   this.authService.logout(user.id);
  // }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@User() user: UserEntity) {
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(user.id, refreshToken);
  }
}
