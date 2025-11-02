import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor() {
    super(
      { header: 'api-key', prefix: '' },
      true,
      async (
        apiKey: string,
        done: (error: Error, user?: any, info?: any) => void,
      ) => await this.validate(apiKey, done),
    );
  }

  async validate(
    apiKey: string,
    done: (error: Error, user?: any, info?: any) => void,
  ): Promise<void> {
    try {
      // Your logic to validate the API key
      const isValidApiKey = this.validateApiKey(apiKey);

      if (!isValidApiKey) {
        return done(new UnauthorizedException(`ERROR: Invalid API key`), false);
      }

      // You can optionally pass user information to the next middleware
      const user = { apiKey };
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }

  private validateApiKey(apiKey: string): boolean {
    // Your logic to validate the API key
    // Return true if the API key is valid, otherwise false
    // You might want to store valid API keys in a configuration file or a database
    return apiKey === process.env.API_KEY;
  }
}
