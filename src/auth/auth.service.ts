import { JWT_TYPE } from '@/common/constants/jwt.type';
import { sendMail } from '@/common/mails';
import { MessageName } from '@/message';
import { APP_NAME, CLIENT_URL } from '@environments';
import { AccessDeniedException } from '@exceptions/access-denied.exception';
import { ExistsException } from '@exceptions/exists.exeption';
import { ExpiredException } from '@exceptions/expired.exception';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { NotFoundException } from '@exceptions/not-found.exception';
import { VerifiedException } from '@exceptions/verified.exeption';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new ExistsException(MessageName.USER);
    }

    // Hash password
    const hash = this.hashData(createUserDto.password);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });

    const verifyToken = await this.jwtService.signAsync(
      {
        sub: newUser.id,
      },
      {
        secret: this.configService.get<string>(JWT_TYPE.JWT_VERIFY_SECRET),
        expiresIn: '5m',
      },
    );
    await this.updateVerifyToken(newUser.id, verifyToken);
    sendMail(newUser.email, 'VERIFY', {
      companyName: APP_NAME,
      recipient: newUser.name,
      link: `${CLIENT_URL}/verify?token=${verifyToken}`,
    });
    return newUser;
  }

  async resend(email: string) {
    const user = await this.usersService.findByEmail(email, {
      select: ['id', 'verifyToken', 'name'],
    });

    if (!user) {
      throw new NotFoundException(MessageName.USER);
    }
    if (!user.verifyToken) {
      throw new VerifiedException(MessageName.USER);
    }
    const verifyToken = await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret: this.configService.get<string>(JWT_TYPE.JWT_VERIFY_SECRET),
        expiresIn: '5m',
      },
    );
    await this.updateVerifyToken(user.id, verifyToken);
    sendMail(email, 'VERIFY', {
      companyName: APP_NAME,
      recipient: user.name,
      link: `${CLIENT_URL}/verify?token=${verifyToken}`,
    });
  }

  async verify(token: string) {
    try {
      const result = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(JWT_TYPE.JWT_VERIFY_SECRET),
      });
      const user = await this.usersService.findById(result.sub);
      if (!user) {
        throw new NotFoundException(MessageName.USER);
      }
      await this.updateVerifyToken(user.id, null);
      sendMail(user.email, 'WELCOME', {
        companyName: APP_NAME,
        recipient: user.name,
      });
      return user;
    } catch (error) {
      console.log(error);

      throw new ExpiredException(MessageName.TOKEN);
    }
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) throw new NotFoundException(MessageName.USER);

    const passwordMatches = user.comparePassword(data.password);
    if (!passwordMatches) throw new IncorrectException(MessageName.USER);

    const tokens = await this.getTokens(user.id, user.email);

    return {
      ...tokens,
      ...user,
    };
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

  async updateVerifyToken(userId: number, verifyToken: string) {
    const hashedverifyToken = verifyToken
      ? await this.hashData(verifyToken)
      : null;
    await this.usersService.update(userId, {
      verifyToken: hashedverifyToken,
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
          expiresIn: '1d',
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
