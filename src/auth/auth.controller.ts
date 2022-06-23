import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Redirect,
} from '@nestjs/common';

import { LoginService } from './login.service';
import { GoogleLoginDto, LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { GoogleAuthBodyDto, GoogleAuthResDto } from './dto/google.auth.dto';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterService } from './register.service';
import { AuthService } from './auth.service';
import { Request, response, Response } from 'express';
import { LoginResDto } from './dto/response/login.res.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { request } from 'http';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly googleService: GoogleService,
    private readonly usersService: UsersService,
    private readonly registerService: RegisterService,
    private readonly authService: AuthService,
  ) {}

  @Get('email')
  public async emailTest() {
    this.registerService.sendMailTest();
    return 'success';
  }

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
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
    return accessToken;
  }

  @Post('register')
  public async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.registerService.register(registerUserDto);
    const accessToken = (
      await this.authService.getTokens({
        uid: user.id,
        email: user.email,
      })
    ).access_token;
    console.log(accessToken);
    const { refreshToken, ...refreshCookieOption } =
      this.authService.getCookieWithJwtRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);
    //safe way is to send refresh token as cookie, and access token as json payload
    response.cookie('Refresh', refreshToken, refreshCookieOption);
    console.log(refreshCookieOption);
    return accessToken;
  }

  // @Post()

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  public async refresh(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = (
      await this.authService.getTokens({
        uid: request.user.id,
        email: request.user.email,
      })
    ).access_token;
    console.log('controller', accessToken);
    return accessToken;
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  public async logOut(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
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

  @Post('google/authenticate')
  public async authenticateGoogle(
    @Body() googleAuthBodyDto: GoogleAuthBodyDto,
    @Req() req,
  ) {
    const result = await this.googleService.authenticate(
      googleAuthBodyDto.token,
    );
    return { user: result.user, email: result.email };
  }

  // @Get('google/callback') // 2
  // async googleAuthRedirect(@Req() req, @Res() res) {
  //   // return res.redirect
  //   console.log(req.user);
  //   return this.loginService.googleLogin(req);
  // }
}
