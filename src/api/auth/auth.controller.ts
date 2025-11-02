import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
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
import { AuthService } from './auth.service';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { Users } from '../users/entities/user.entity';
import {
  BAD_REQUEST_RESPONSE,
  FORGOT_PASSWORD_RESPONSE,
  INVALID_USER_RESPONSE,
  RESET_PASSWORD_RESPONSE,
  UNAUTHORIZE_RESPONSE,
  USER_EXISTS_RESPONSE,
  USER_LOGIN_RESPONSE,
  USER_LOGOUT_RESPONSE,
  USER_REGISTRATION_RESPONSE,
  VERIFY_RESET_PASSWORD_OTP_RESPONSE,
} from 'src/common/swagger.response';
import { JwtAuthGuard } from 'src/common/passport/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from './dto/verify-reset-password-otp.dto';
// import { SocialLoginDto } from './dto/social-login.dto';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('Auth')
@Controller('api/v1')
@UsePipes(ValidationPipe)
// @ApiSecurity('api_key', ['Api-Key'])
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register user
   * @param registerDto
   * @returns
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register user',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(USER_REGISTRATION_RESPONSE)
  @ApiResponse(USER_EXISTS_RESPONSE)
  async register(@Body() registerDto: RegisterDto) {

    const user = await this.authService.register(registerDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'You are successfully registered with us!',
      data: plainToInstance(Users, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Login user with email and password
   * @param loginDto
   * @returns
   */
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(USER_LOGIN_RESPONSE)
  @ApiResponse(INVALID_USER_RESPONSE)
  async login(@Body() loginDto: LoginDto) {

    const user = await this.authService.login(loginDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'You are successfully logged in',
      data: plainToInstance(Users, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Social login
   * @returns
   */
  // @Post('social-login')
  // @ApiOperation({
  //   summary: 'Social login',
  //   description: `    providerType = google, apple
  //   pass idToken for google/apple login => idToken
  //   pass email if mail is hidden in apple login`,
  // })
  // @HttpCode(HttpStatus.CREATED)
  // @ApiResponse(USER_LOGIN_RESPONSE)
  // @ApiResponse(UNAUTHORIZE_RESPONSE)
  // async socialLogin(@Body() socialLoginDto: SocialLoginDto) {
  //   const user = await this.authService.socialLogin(socialLoginDto);

  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'You are successfully logged in',
  //     data: plainToInstance(Users, user, {
  //       enableImplicitConversion: true,
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }

  /**
   * Forgot password
   * @param forgotPasswordDto
   * @returns
   */
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot Password',
  })
  @ApiResponse(FORGOT_PASSWORD_RESPONSE)
  @ApiResponse(INVALID_USER_RESPONSE)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgetPassword(forgotPasswordDto);
    return {
      statusCode: HttpStatus.CREATED,
      message:
        'A authentication code has been sent to your registered email address',
    };
  }

  /**
   * Verify reset password OTP
   * @param verifyResetPasswordOtpDto
   * @returns
   */
  @Post('verify-reset-password-otp')
  @ApiOperation({
    summary: 'Verify Reset Password OTP',
  })
  @ApiResponse(VERIFY_RESET_PASSWORD_OTP_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async verifyResetPasswordOTP(
    @Body() verifyResetPasswordOtpDto: VerifyResetPasswordOtpDto,
  ) {
    await this.authService.verifyResetPasswordOtp(verifyResetPasswordOtpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'OTP has been successfully verified',
    };
  }

  /**
   * Reset password
   * @param resetPasswordDto
   * @returns
   */
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset Password',
  })
  @ApiResponse(RESET_PASSWORD_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password has been successfully changed',
    };
  }

  /**
   * Logout user
   * @param authUser
   * @returns
   */
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse(USER_LOGOUT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @UseGuards(JwtAuthGuard)
  async logout(@AuthUser() authUser: Users, @Body() logoutDto: LogoutDto) {
    await this.authService.logout(authUser, logoutDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'You are successfully logged out',
    };
  }
}

