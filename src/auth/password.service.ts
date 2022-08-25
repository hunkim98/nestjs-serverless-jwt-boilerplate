import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { notificationWithLinkHtml } from '../mailer/templates/notificationWithLink';
import { notificationHtml } from '../mailer/templates/notification';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  public async returnAccessTokenFromVerificationToken({
    code,
  }: {
    code: string;
  }) {
    const verification = await this.prisma.verification.findUnique({
      where: { code },
      include: { user: true },
    });

    const now = new Date();
    console.log(verification, 'this is verification');
    if (!verification || !verification.user || now > verification.expireAt) {
      throw new HttpException(
        'The password change url has expired',
        HttpStatus.UNPROCESSABLE_ENTITY, // 422
      );
    }
    const { access_token, refresh_token } = await this.authService.getTokens({
      uid: verification.user.id,
      email: verification.user.email,
    });
    return access_token;
  }

  public async changePassword({
    uid,
    password,
  }: {
    uid: number;
    password: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: uid },
    });
    if (!user) {
      throw new HttpException(
        'The user does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY, // 422
      );
    }
    await this.usersService.changeUserPassword(uid, password);
    //this automatically brcrypts the password
    await this.sendMailChangePassword(user);
    return user;
  }

  public async forgotPassword(email: string) {
    return (await this.issueChangePasswordCode({ email })) ? true : false;
  }

  public async issueChangePasswordCode({ email }: { email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: { verification: true },
    });
    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const now = new Date();
    const afterFifteenMinutesFromNow = new Date();
    afterFifteenMinutesFromNow.setMinutes(now.getMinutes() + 15);
    const verificationCode = uuidv4() + '_' + user.id + '_password';
    const existingVerification = await this.prisma.verification.findUnique({
      where: { id: user.verificationId },
    });
    if (existingVerification) {
      await this.prisma.verification.update({
        where: { id: user.verificationId },
        data: { expireAt: afterFifteenMinutesFromNow, code: verificationCode },
      });
    } else {
      const newVerification = await this.prisma.verification.create({
        data: {
          expireAt: afterFifteenMinutesFromNow,
          code: verificationCode,
        },
      });
      this.prisma.user.update({
        where: { id: user.id },
        data: {
          verificationId: newVerification.id,
        },
      });
    }
    await this.sendMailForgotPassword(user, verificationCode);
    return verificationCode;
  }

  private async sendMailChangePassword(user: User): Promise<any> {
    //title, nameuser, description
    return this.mailerService
      .sendMail({
        to: user.email,
        subject: 'The password has successfully changed',
        text: 'The password has successfully changed',
        html: notificationHtml({
          title: 'The password has successfully changed',
          nickname: user.nickname,
          description: 'The password has successfully changed',
        }),
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private async sendMailForgotPassword(
    user: User,
    verificationCode: string,
  ): Promise<any> {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Change Password',
      text: 'Change Password',
      html: notificationWithLinkHtml({
        title: 'Change Password',
        description:
          'This is a change password email.<br/> Click the button below to proceed',
        nickname: user.nickname,
        url: `${this.configService.get<string>(
          'CLIENT_URL',
        )}/account/password/${verificationCode}`,
        buttonText: 'Change password',
      }),
    });
  }
}
