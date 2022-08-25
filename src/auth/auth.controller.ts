import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Redirect,
  BadRequestException,
  Param,
} from '@nestjs/common';

import { LoginService } from './login.service';
import { GoogleLoginDto, LoginDto } from './dto/body/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { GoogleAuthBodyDto, GoogleAuthResDto } from './dto/google.auth.dto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/body/register.dto';
import { RegisterService } from './register.service';
import { AuthService } from './auth.service';
import { Request, response, Response } from 'express';
import { LoginResDto } from './dto/response/login.res.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { request } from 'http';
import { JwtGuard } from './guards/jwt.guard';
import { VerifyRegisterDto } from './dto/body/verifyRegister.dto';
import { RefreshResDto } from './dto/response/refresh.res.dto';
import RoleGuard from './guards/role.guard';
import { IsUserGuard } from './guards/is-user.guard';
import { PasswordService } from './password.service';
import { ForgotPasswordDto, PostPasswordDto } from './dto/body/password.dto';
import { PostPasswordResDto } from './dto/response/post.password.res.dto';
import { GetPasswordTokenResDto } from './dto/response/get.password.token.res.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly googleService: GoogleService,
    private readonly usersService: UsersService,
    private readonly registerService: RegisterService,
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
  ) {}

  //this is just for checking
  @UseGuards(IsUserGuard)
  @Get('check')
  public async check(@Req() req) {
    const isUser = req.user && true;
    console.log(isUser);
    return 'success';
  }

  @UseGuards(JwtGuard)
  @Post('password')
  public async changePassword(
    @Req() request: RequestWithUser,
    @Body() changePasswordDto: PostPasswordDto,
  ): Promise<PostPasswordResDto> {
    const changedUser = await this.passwordService.changePassword({
      uid: request.user.id,
      password: changePasswordDto.password,
    });
    return { success: changedUser ? true : false };
  }

  @Get('password/token/:code')
  public async returnAccessTokenFromVerificationToken(
    @Param('code') code: string,
  ): Promise<GetPasswordTokenResDto> {
    const accessToken =
      await this.passwordService.returnAccessTokenFromVerificationToken({
        code,
      });
    return { accessToken };
  }

  @Post('password/forgot')
  public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const changedUser = await this.passwordService.forgotPassword(
      forgotPasswordDto.email,
    );
    return changedUser ? true : false;
  }

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResDto> {
    const user = await this.loginService.login(loginDto);
    const accessToken = (
      await this.authService.getTokens({
        uid: user.id,
        email: user.email,
      })
    ).access_token;
    const { refreshToken, ...refreshCookieOption } =
      this.authService.getCookieWithJwtRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);
    response.cookie('Refresh', refreshToken, refreshCookieOption);
    return {
      accessToken: accessToken,
      isEmailVerified: user.verified,
      role: user.role,
      email: user.email,
      name: user.name,
      telephone: user.telephone,
    };
  }

  @Post('register')
  public async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('hihi');
    const user = await this.registerService.register(registerDto);
    const accessToken = (
      await this.authService.getTokens({
        uid: user.id,
        email: user.email,
      })
    ).access_token;
    const { refreshToken, ...refreshCookieOption } =
      this.authService.getCookieWithJwtRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);
    //safe way is to send refresh token as cookie, and access token as json payload
    response.cookie('Refresh', refreshToken, refreshCookieOption);
    console.log(refreshCookieOption);
    return accessToken;
  }

  @UseGuards(JwtGuard)
  @Get('register/token')
  public async getRegisterToken(
    @Req() request: RequestWithUser,
  ): Promise<void> {
    await this.registerService.issueRegisterCode(request.user.id);
  }

  //RoleGuard empty array means anyone can access it
  // @UseGuards(RoleGuard([]))
  @Post('register/verify')
  public async verifyRegister(
    @Body() body: VerifyRegisterDto,
  ): Promise<boolean> {
    const success = await this.registerService.verifyRegisterCode(body.code);
    if (!success) {
      throw new BadRequestException('Token has expired');
    }
    return success;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refresh(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResDto> {
    const accessToken = (
      await this.authService.getTokens({
        uid: request.user.id,
        email: request.user.email,
      })
    ).access_token;
    return {
      accessToken: accessToken,
      isEmailVerified: request.user.verified,
      role: request.user.role,
      email: request.user.email,
      name: request.user.name,
      telephone: request.user.telephone,
    };
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  public async logOut(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshOption = this.authService.getCookiesForLogOut();
    await this.usersService.removeRefreshToken(request.user.id);
    response.cookie('Refresh', '', refreshOption);
  }

  // We don't really need this, this should be done in react client side
  // @Get('google') // 1
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {
  //   console.log('google login called');
  // }

  // @Post('google/authenticate')
  // public async authenticateGoogle(
  //   @Body() googleAuthBodyDto: GoogleAuthBodyDto,
  //   @Req() req,
  // ) {
  //   const result = await this.googleService.authenticate(
  //     googleAuthBodyDto.token,
  //   );
  //   return { user: result.user, email: result.email };
  // }

  // @Get('google/callback') // 2
  // async googleAuthRedirect(@Req() req, @Res() res) {
  //   // return res.redirect
  //   console.log(req.user);
  //   return this.loginService.googleLogin(req);
  // }
}
