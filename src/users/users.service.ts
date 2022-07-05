import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Users } from '../entities/users.entity';
import { IUsers } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserProfileDto } from './dto/user-profile.dto';
import { RegisterDto } from '../auth/dto/body/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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

  public async getUserVerificationInfo(verificationId: number) {
    return await this.prisma.verification.findFirst({
      where: { id: verificationId },
    });
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    // const user = await this.userRepository.findOne({
    //   where: {
    //     email: email,
    //   },
    // });

    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }

    return user;
  }

  public async findBySocialLoginId(socialLoginId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { socialLoginId: socialLoginId },
    });
    // const user = await this.userRepository.findOne({
    //   where: { socialLoginId },
    // });
    return user;
  }

  public async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: id,
    //   },
    // });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
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
    // await this.userRepository.update({ id }, { currentHashedRefreshToken });
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
    // return this.userRepository.update(
    //   { id },
    //   {
    //     currentHashedRefreshToken: null,
    //   },
    // );
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

  public async createWithGoogle() {}

  public async updateByEmail(email: string): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { email: email },
        data: {
          password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 8),
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      // const user = await this.userRepository.findOne({
      //   where: { email: email },
      // });
      // user.password = bcrypt.hashSync(password, 10);

      return await this.prisma.user.update({
        where: { email: email },
        data: {
          password: bcrypt.hashSync(password, 10),
        },
      });
      // return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
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

  public async updateProfileUser(
    id: string,
    userProfileDto: UserProfileDto,
  ): Promise<User> {
    try {
      // const user = await this.userRepository.findOne({
      //   where: { id: Number(id) },
      // });
      // user.nickname = userProfileDto.nickname;
      // user.email = userProfileDto.email;
      // user.username = userProfileDto.username;

      return await this.prisma.user.update({
        where: { id: Number(id) },
        data: {
          isSnsAgreed: userProfileDto.isSnsAgreed,
        },
      });

      // return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
