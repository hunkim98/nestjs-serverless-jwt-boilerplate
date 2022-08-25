import {
  Controller,
  Put,
  Get,
  Body,
  Res,
  Param,
  UseGuards,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import RoleGuard from '../auth/guards/role.guard';
import { PostNicknameDto } from './dto/body/post.nickname.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import RequestWithUser from '../auth/interfaces/request-with-user.interface';
import { GetUserAccountResDto } from './dto/response/get.user.account.res.dto';
import { PutUserAccountResDto } from './dto/response/put.user.account.res.dto';
import { PutUserAccountDto } from './dto/body/put.user.account.dto';
import { PostEmailDto } from './dto/body/post.email.dto';
import { PostEmailResDto } from './dto/response/post.email.res.dto';

@ApiTags('users')
// @UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard(['ADMIN']))
  @Get('isAdmin')
  public isAdmin(): boolean {
    return true;
  }

  @Post('/nickname/duplicate')
  public async isNicknameUsed(@Body() body: PostNicknameDto): Promise<boolean> {
    const user = await this.usersService.findUserByNickname(body.nickname);
    return user ? false : true;
  }

  @UseGuards(JwtGuard)
  @Get('account')
  public async getUserAccountInfo(
    @Req() request: RequestWithUser,
  ): Promise<GetUserAccountResDto> {
    const user = await this.usersService.getUserAccountInfo(request.user.id);
    return user;
  }

  @Post('email')
  public async findEmailByNickname(
    @Body() body: PostEmailDto,
  ): Promise<PostEmailResDto> {
    const user = await this.usersService.findByNickname(body.nickname);
    if (!user) {
      throw new HttpException(
        'The user does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { email: user.email };
  }

  @UseGuards(JwtGuard)
  @Put('account')
  public async updateUserAccountInfo(
    @Req() request: RequestWithUser,
    @Body() userAccountDto: PutUserAccountDto,
  ): Promise<PutUserAccountResDto> {
    const user = await this.usersService.updateUserAccountInfo(
      request.user.id,
      userAccountDto,
    );
    return user;
  }
}
