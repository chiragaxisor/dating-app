import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  public configService: ConfigService;
  constructor() {
    this.configService = new ConfigService();
  }

  /**
   * Get base url
   * @param path
   * @returns
   */
  baseUrl(path = '') {
    return this.configService.get('APP_URL') + path;
  }

  /**
   * Get storage path
   * @param value
   * @returns
   */
  storagePath(value = '') {
    return this.baseUrl() + `/storage/${value}`;
  }

  /**
   * Get public path
   * @param value
   * @returns
   */
  publicPath(value = '') {
    return this.baseUrl() + `/${value}`;
  }
}
