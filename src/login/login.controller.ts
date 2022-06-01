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
import { GoogleLoginDto, LoginDto } from '../login/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { GoogleAuthBodyDto, GoogleAuthResDto } from './dto/google.auth.dto';

@ApiTags('auth')
@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.loginService.login(loginDto);
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

  @Get('google/callback') // 2
  async googleAuthRedirect(@Req() req, @Res() res) {
    // return res.redirect
    console.log(req.user);
    return this.loginService.googleLogin(req);
  }
}
