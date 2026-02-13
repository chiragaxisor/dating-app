import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apple IAP Webhook' })
  @ApiResponse({ status: 200, description: 'Acknowledged' })
  async appleWebhook(@Body() payload: any) {
    return await this.webhooksService.handleAppleWebhook(payload);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google Play Webhook' })
  @ApiResponse({ status: 200, description: 'Acknowledged' })
  async googleWebhook(@Body() payload: any) {
    return await this.webhooksService.handleGoogleWebhook(payload);
  }
}
