import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('api')
export class ApiController {
  /**
   * API changelogs
   */
  @Get('api/changelogs')
  @ApiExcludeEndpoint()
  @Render('api/change-logs')
  async apiChangeLogs() {
    return true;
  }

  /**
   * Chat
   */
  @Get('chat')
  @Render('chat/index')
  async Chat() {
    return null;
  }

  /**
   * Chat changelogs
   */
  @Get('chat/changelogs')
  @Render('chat/changelogs')
  async ChatChangelog() {
    return null;
  }


}
