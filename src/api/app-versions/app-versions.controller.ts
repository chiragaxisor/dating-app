import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CHECK_APP_VERSION_RESPONSE } from 'src/common/swagger.response';
import { AppVersionsService } from './app-versions.service';
import { CheckAppVersionDto } from './dto/check-app-version.dto';

@ApiTags('App Version')
@Controller('api/v1')
@UsePipes(ValidationPipe)
// @ApiSecurity('api_key', ['Api-Key'])
export class AppVersionsController {
  constructor(private readonly appVersionsService: AppVersionsService) {}

  /**
   * Check app version
   * @param checkAppVersionDto
   * @returns
   */
  @Post('check-app-version')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Check app version',
    description: `    platform : iOS, Android
    status= 0: Up to date, 1: Force Update, 2: Recommended Update (Optional Update)`,
  })
  @ApiResponse(CHECK_APP_VERSION_RESPONSE)
  async checkVersion(@Body() checkAppVersionDto: CheckAppVersionDto) {
    const data = await this.appVersionsService.check(checkAppVersionDto);
    return {
      statusCode: HttpStatus.CREATED,
      ...data,
    };
  }
}
