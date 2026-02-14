import { UsersService } from '../users/users.service';
export declare class WebhooksService {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    handleAppleWebhook(payload: any): Promise<{
        status: string;
    }>;
    handleGoogleWebhook(payload: any): Promise<{
        status: string;
    }>;
}
