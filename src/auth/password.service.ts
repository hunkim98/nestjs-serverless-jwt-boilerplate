import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { User } from '@prisma/client';

@Injectable()
export class PasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
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
          nameUser: user.nickname,
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
