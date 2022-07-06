import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  public async changePassword(
    uid: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(uid);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordValid) {
      const userWithUpdatedPassword =
        await this.usersService.changeUserPassword(uid, newPassword);
      this.sendMailChangePassword(userWithUpdatedPassword);
      return userWithUpdatedPassword;
    } else {
      throw new HttpException(
        'user password is wrong',
        HttpStatus.FORBIDDEN, // 403
      );
    }
  }

  private sendMailChangePassword(user: User): void {
    //title, nameuser, description
    this.mailerService
      .sendMail({
        to: user.email,
        subject: '비밀번호 변경이 완료되었습니다',
        text: '비밀번호 변경이 완료되었습니다',
        template: 'notification',
        context: {
          title: '비밀번호 변경',
          description: '비밀번호 변경이 완료되었습니다',
          nickname: user.nickname,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    const randomPassword = Math.random().toString(36).slice(-8);
    const userUpdate = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: bcrypt.hashSync(randomPassword, 10) },
    });
    this.sendMailForgotPassword(userUpdate, randomPassword);
    return userUpdate;
  }

  private sendMailForgotPassword(user: User, password: string): void {
    //title, nameuser, description
    this.mailerService
      .sendMail({
        to: user.email,
        subject: '임시 비밀번호가 발급되었습니다',
        text: '임시 비밀번호가 발급되었습니다',
        template: 'forgotPassword',
        context: {
          title: '임시 비밀번호가 발급되었습니다',
          description: '임시 비밀번호가 발급되었습니다',
          nickname: user.nickname,
          password: password,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
