import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/body/register.dto';

import { AuthService } from './auth.service';
import { Tokens } from './dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { registerHtml } from '../mailer/templates/register';
import { notificationWithLinkHtml } from '../mailer/templates/notificationWithLink';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  public async register(registerUserDto: RegisterDto): Promise<User> {
    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 10);
    const existingUser = await this.usersService.findByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new HttpException(
        'The email is already being used!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      ); //422)
    }

    const newUser = await this.usersService.create(registerUserDto);
    const newUserVerification = await this.usersService.getUserVerificationInfo(
      newUser.verificationId,
    );

    await this.sendMailVerification(newUser, newUserVerification.code);
    return newUser;
  }

  public async issueRegisterCode(uid: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: uid },
      include: { verification: true },
    });
    const now = new Date();
    const afterFiveMinutesFromNow = new Date();
    afterFiveMinutesFromNow.setMinutes(now.getMinutes() + 5);
    const newUserVerification = await this.prisma.verification.update({
      where: { id: user.verification.id },
      data: { expireAt: afterFiveMinutesFromNow, code: uuidv4() },
    });
    await this.sendMailVerification(user, newUserVerification.code);
  }

  public async verifyRegisterCode(code: string) {
    const verification = await this.prisma.verification.findFirst({
      where: { code: code },
      include: { user: true },
    });
    const now = new Date();
    if (verification && now < verification.expireAt) {
      if (!verification.user.verified) {
        await this.sendMailRegisterUser(verification.user);
      }
      await this.prisma.user.update({
        where: { id: verification.user.id },
        data: { verified: true },
      });
      return true;
    }
    return false;
  }

  private async sendMailVerification(
    user: User,
    verificationCode: string,
  ): Promise<any> {
    return this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Verify Email',
        text: 'Verify Email',
        html: notificationWithLinkHtml({
          title: 'Verify Email',
          nickname: user.nickname,
          description:
            'This is a verify email email. Click the button below to proceed',
          url: `${this.configService.get<string>(
            'CLIENT_URL',
          )}/verify/${verificationCode}`,
          buttonText: 'Verify email',
        }),
      })
      .then((response) => {
        console.log(response);
        console.log('User Register Verification: Send Mail successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('User Register Verification: Send Mail Failed!');
      });
  }

  private async sendMailRegisterUser(user: User): Promise<any> {
    return this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Welcome to our service!',
        text: 'Welcome to our service!',
        html: registerHtml({
          title: 'Welcome to our service!',
          nickname: user.nickname,
        }),
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
