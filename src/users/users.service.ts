import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '../auth/dto/body/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PutUserAccountDto } from './dto/body/put.user.account.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid ? user : null;
    } else {
      return null;
    }
  }

  public async findUserByNickname(nickname: string) {
    const user = await this.prisma.user.findUnique({
      where: { nickname: nickname },
    });
    return user;
  }

  public async getUserVerificationInfo(verificationId: number) {
    return await this.prisma.verification.findFirst({
      where: { id: verificationId },
    });
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    return user;
  }

  public async findByNickname(nickname: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { nickname } });
    return user;
  }

  public async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    return user;
  }

  /** We hash the refresh token again for safety.
   * the hashed refresh token is saved into user repository  */
  async setCurrentRefreshToken(id: number, refreshToken: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: id },
      data: { currentHashedRefreshToken: currentHashedRefreshToken },
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: number,
  ): Promise<User> {
    const user = await this.findById(id);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: number) {
    return this.prisma.user.update({
      where: { id: id },
      data: { currentHashedRefreshToken: null },
    });
  }

  public async create(registerUserDto: RegisterDto): Promise<User> {
    try {
      const now = new Date();
      const afterFiveMinutesFromNow = new Date();
      afterFiveMinutesFromNow.setMinutes(now.getMinutes() + 5);
      //after 5 minutes the url is not confirmed
      const verification = await this.prisma.verification.create({
        data: { expireAt: afterFiveMinutesFromNow, code: uuidv4() },
      });
      return await this.prisma.user.create({
        //connect for one to one relationship
        data: {
          ...registerUserDto,
          verification: { connect: { id: verification.id } },
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // public async createWithGoogle() {}

  public async findBySocialLoginId(socialLoginId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { socialLoginId: socialLoginId },
    });
    return user;
  }

  public async changeUserPassword(id: number, newPassword: string) {
    try {
      return await this.prisma.user.update({
        where: { id: id },
        data: {
          password: bcrypt.hashSync(newPassword, 10),
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async getUserAccountInfo(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return {
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      telephone: user.telephone,
      isSnsAgree: user.isSnsAgreed,
    };
  }

  public async updateUserAccountInfo(
    id: number,
    userAccountDto: PutUserAccountDto,
  ) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          isSnsAgreed: userAccountDto.isSnsAgreed,
          telephone: userAccountDto.telephone,
        },
      });
      return {
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        telephone: user.telephone,
        isSnsAgree: user.isSnsAgreed,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
