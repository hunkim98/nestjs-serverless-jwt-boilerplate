import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailerService } from '../mailer/mailer.service';
import { AuthService } from './auth.service';
import { Tokens } from './dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registerUserDto: RegisterUserDto): Promise<User> {
    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 10);

    const newUser = await this.usersService.create(registerUserDto);
    const newUserVerification = await this.usersService.getUserVerificationInfo(
      newUser.verificationId,
    );

    this.sendMailRegisterUser(newUser, newUserVerification.code);
    return newUser;
  }

  sendMailTest(): void {
    this.mailerService
      .sendMail({
        to: 'hunkim98@gmail.com',
        // we have set from in the service constructor
        // from: this.configService.get('EMAIL_AUTH_USER'),
        subject: 'Registration successful ✔',
        text: 'Registration successful!',
        template: 'index',
        context: {
          title: 'Registration successfully',
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: 'hunkim98',
          url: `${this.configService.get<string>('CLIENT_URL')}/verify/${2222}`,
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
        subject: 'Registration successful ✔',
        text: 'Registration successful!',
        template: 'index',
        context: {
          title: 'Registration successfully',
          description:
            "You did it! You registered!, You're successfully registered.✔",
          nameUser: user.nickname,
          url: `${this.configService.get<string>(
            'CLIENT_URL',
          )}/verify/${verificationCode}`,
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
