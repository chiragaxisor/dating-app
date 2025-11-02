import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  /**
   * Index page
   * @returns
   */
  @Get()
  index() {
    return {
      message: `App Name API - Please read our documentation for more info: ${process.env.APP_URL}/api/documentation`,
    };
  }

  /**
   * Term and condition
   * @returns
   */
  @Get('terms-and-conditions')
  @Render('pages/terms-and-conditions')
  termsAndConditions() {
    return null;
  }

  /**
   * About us
   * @returns
   */
  @Get('about-us')
  @Render('pages/about-us')
  aboutUs() {
    return null;
  }

  /**
   * Privacy policy
   * @returns
   */
  @Get('privacy-policy')
  @Render('pages/privacy-policy')
  privacyPolicy() {
    return null;
  }

  /**
   * Support
   * @returns
   */
  @Get('support')
  @Render('pages/support')
  support() {
    return null;
  }
}
