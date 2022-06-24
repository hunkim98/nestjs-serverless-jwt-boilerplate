import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/body/register.dto';
import { MailerService } from '../mailer/mailer.service';
import { AuthService } from './auth.service';
import { Tokens } from './dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  public async register(registerUserDto: RegisterDto): Promise<User> {
    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 10);

    const newUser = await this.usersService.create(registerUserDto);
    const newUserVerification = await this.usersService.getUserVerificationInfo(
      newUser.verificationId,
    );

    this.sendMailRegisterUser(newUser, newUserVerification.code);
    return newUser;
  }

  public async verifyRegisterCode(code: string) {
    const verification = await this.prisma.verification.findFirst({
      where: { code: code },
      include: { user: true },
    });
    if (verification) {
      await this.prisma.user.update({
        where: { id: verification.user.id },
        data: { verified: true },
      });
      return true;
    }
    return false;
  }

  sendMailTest(): void {
    this.mailerService
      .sendMail({
        to: 'hunkim98@gmail.com',
        // we have set from in the service constructor
        // from: this.configService.get('EMAIL_AUTH_USER'),
        subject: '이메일 인증',
        text: '이메일 인증',
        template: 'index',
        context: {
          title: '이메일 인증',
          description: '이메일 인증을 하려면 아래 버튼을 클릭해주세요',
          nameUser: 'hunkim98',
          url: `${this.configService.get<string>('CLIENT_URL')}/verify/${2222}`,
          urlButtonText: '등록 확인',
        },
      })
      .then((response) => {
        console.log(response);
        console.log('User Registration: Send Mail successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('User Registration: Send Mail Failed!');
      });
  }

  private sendMailRegisterUser(user: User, verificationCode: string): void {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: '이메일 인증',
        text: '이메일 인증',
        template: 'index',
        context: {
          title: '이메일 인증',
          description: '이메일 인증을 하려면 아래 버튼을 클릭해주세요',
          nameUser: user.nickname,
          url: `${this.configService.get<string>(
            'CLIENT_URL',
          )}/verify/${verificationCode}`,
          urlButtonText: '등록 확인',
        },
      })
      .then((response) => {
        console.log(response);
        console.log('User Registration: Send Mail successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('User Registration: Send Mail Failed!');
      });
  }
}
