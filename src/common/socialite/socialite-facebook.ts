import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SocialiteFacebook {
  constructor(private readonly httpService: HttpService) {}

  async generateUserFromToken(token: string) {
    try {
      const payload = await lastValueFrom(
        this.httpService.get('https://graph.facebook.com/me', {
          params: {
            fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(
              ',',
            ),
            access_token: token,
          },
        }),
      );

      return {
        providerId: payload.data.id,
        email: payload.data.email,
        name: payload.data.first_name + payload.data.last_name,
        profile: `https://graph.facebook.com/${payload.data.id}/picture?type=large`,
      };
    } catch (err) {
      throw new UnauthorizedException(
        'Error while authenticating facebook user',
      );
    }
  }
}
