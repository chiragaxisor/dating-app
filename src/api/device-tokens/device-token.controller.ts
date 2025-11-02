import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import {
  REGISTER_DEVICE_TOKEN_RESPONSE,
  SEND_PUSH_RESPONSE,
} from 'src/common/swagger.response';
import { Users } from '../users/entities/user.entity';
import { DeviceTokenService } from './device-token.service';
import { CreateDeviceTokenDto } from './dtos/create-device-token.dto';
import { SendNotificationDto } from './dtos/send-notification.dto';
import { JwtAuthGuard } from 'src/common/passport/jwt-auth.guard';

@ApiTags('Device Token')
@Controller('api/v1/')
@ApiSecurity('api_key', ['Api-Key'])
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  /**
   * Register device token for push notification
   * @param authUser
   * @param createDeviceTokenDto
   * @returns
   */
  @Post('device-tokens')
  @ApiOperation({
    summary: 'Register device token for push notification',
    description: '    deviceType: iOS | Android',
  })
  @ApiResponse(REGISTER_DEVICE_TOKEN_RESPONSE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async create(
    @AuthUser() authUser: Users,
    @Body() createDeviceTokenDto: CreateDeviceTokenDto,
  ) {
    await this.deviceTokenService.create(createDeviceTokenDto, authUser);
    return {
      statusCode: HttpStatus.OK,
      message: 'Device token registered successfully',
    };
  }

  /**
   * Send test push notification
   * @param sendNotificationDto
   * @returns
   */
  @Post('send-notification')
  @ApiOperation({
    summary: 'Send test push notification',
  })
  @ApiResponse(SEND_PUSH_RESPONSE)
  @HttpCode(HttpStatus.OK)
  async sendPush(@Body() sendNotificationDto: SendNotificationDto) {
    await this.deviceTokenService.sendPush(sendNotificationDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notification successfully sent',
    };
  }
}
