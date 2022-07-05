import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(private readonly usersService: UsersService) {}

  public async changePassword(
    uid: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(uid);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordValid) {
      return this.usersService.changeUserPassword(uid, newPassword);
    } else {
      throw new HttpException(
        'user password is wrong',
        HttpStatus.FORBIDDEN, // 403
      );
    }
  }
}
