import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    // @InjectRepository(Users)
    // private userRepository: Repository<Users>,
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    try {
      const passwordRand = Math.random().toString(36).slice(-8);
      const userUpdate = await this.prisma.user.update({
        where: { email: forgotPasswordDto.email },
        data: { password: bcrypt.hashSync(passwordRand, 10) },
      });
      this.sendMailForgotPassword(userUpdate.email, passwordRand);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    // const userUpdate = await this.prisma.user.findFirst({
    //   where: { email: forgotPasswordDto.email },
    // });
    // const passwordRand = Math.random().toString(36).slice(-8);
    // userUpdate.password = bcrypt.hashSync(passwordRand, 10);

    // this.sendMailForgotPassword(userUpdate.email, passwordRand);

    // return await this.userRepository.save(userUpdate);
  }

  private passwordRand(password): string {
    const passwordRand = Math.random().toString(36).slice(-8);
    password = bcrypt.hashSync(passwordRand, 10);
    return password;
  }

  private sendMailForgotPassword(email, password): void {
    this.mailerService
      .sendMail({
        to: email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        template: 'index',
        context: {
          title: 'Forgot Password successful!',
          description:
            'Request Reset Password Successfully!  ✔, This is your new password: ' +
            password,
        },
      })
      .then((response) => {
        console.log(response);
        console.log('Forgot Password: Send Mail successfully!');
      })
      .catch((err) => {
        console.log(err);
        console.log('Forgot Password: Send Mail Failed!');
      });
  }
}
