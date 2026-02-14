import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    appleWebhook(payload: any): Promise<{
        status: string;
    }>;
    googleWebhook(payload: any): Promise<{
        status: string;
    }>;
}
