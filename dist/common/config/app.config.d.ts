import { ConfigService } from '@nestjs/config';
export declare class AppConfig {
    configService: ConfigService;
    constructor();
    baseUrl(path?: string): string;
    storagePath(value?: string): string;
    publicPath(value?: string): string;
}
