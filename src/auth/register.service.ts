import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailerService } from '../mailer/mailer.service';
import { AuthService } from './auth.service';
import { Tokens } from './dto/token.dto';
import { IUsers } from 'src/users/interfaces/users.interface';
import { Users } from '../entities/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registerUserDto: RegisterUserDto): Promise<Users> {
    registerUserDto.password = bcrypt.hashSync(registerUserDto.password, 10);

    const newUser = await this.usersService.create(registerUserDto);
    // this.sendMailRegisterUser(registerUserDto);
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

  private sendMailRegisterUser(user): void {
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
          nameUser: user.name,
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
