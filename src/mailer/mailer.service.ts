import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_AUTH_USER'),
        pass: this.configService.get<string>('EMAIL_AUTH_PASSWORD'),
      },
      debug: process.env.NODE_ENV === 'dev',
      logger: process.env.NODE_ENV === 'dev',
      from: this.configService.get<string>('EMAIL_FROM'),
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail({
      ...options,
      from: this.configService.get<string>('EMAIL_FROM'),
    });
  }
}
