import { Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;
  constructor(private readonly usersService: UsersService) {
    this.oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID as string,
      process.env.GOOGLE_SECRET as string,
      //the below is the redirect uri. If we got auth code from client, the redirect should be client
      //redirect uri is necessary for authenticating authorization token
      'http://localhost:3000',
    );
  }
  async authenticate(token: string) {
    const userCredentials = await this.oauthClient.getToken(token);
    if (!userCredentials) {
      return undefined;
    }
    this.oauthClient.setCredentials(userCredentials.tokens);
    const accessToken = (await this.oauthClient.getAccessToken()).token;
    const userInfo = await this.oauthClient.getTokenInfo(accessToken);
    const user = await this.usersService.findBySocialLoginEmail(userInfo.email);
    return { user: user, email: userInfo.email };
  }
}
