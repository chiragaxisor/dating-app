import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AccessTokensService } from '../access-tokens/access-tokens.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { Users } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import {
  comparePassword,
  encodePassword,
} from 'src/common/helper/bcrypt.helper';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as moment from 'moment';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from './dto/verify-reset-password-otp.dto';
// import { SocialLoginDto } from './dto/social-login.dto';
// import { ProviderTypes } from 'src/common/constants';
// import SocialiteGoogle from 'src/common/socialite/socialite-google';
// import { SocialiteApple } from 'src/common/socialite/socialite-apple';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTokens } from '../device-tokens/entities/device-tokens.entity';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private accessTokensService: AccessTokensService,
    private refreshTokensService: RefreshTokensService,
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(DeviceTokens)
    private deviceTokenRepository: Repository<DeviceTokens>,
  ) {}

  /**
   * Register user
   * @param loginDto
   * @returns
   */
  async register(registerDto: RegisterDto) {
    const user: Users = await this.usersService.findByEmail(registerDto.email);

    if (user) {
      throw new BadRequestException('This email is already registered with us');
    }

    const registeredUser = await this.usersService.createOrUpdate({
      ...registerDto,
      password: encodePassword(registerDto.password),
    });

    const tokens = await this.generateTokens(registeredUser);

    return {
      ...registeredUser,
      authentication: { ...tokens },
    };
  }

  /**
   * Login user
   * @param loginDto
   * @returns
   */
  async login(loginDto: LoginDto) {
    const user: Users = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
        // isSocialLoggedIn: false,
        isBlocked: false,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'This email is not registered with us. Please register first!',
      );
    }

    if (user.deletedAt) {
      throw new BadRequestException(
        'Your account has been temporarily disabled. Contact the administrator for more information.',
      );
    }

    if (!comparePassword(loginDto.password, user.password)) {
      throw new ConflictException(
        'Invalid password! Please check your password and try again.',
      );
    }

    const registeredUser = await this.usersService.createOrUpdate(
      {
        ...user,
        // isFirstTimeUser: false,
      },
      user.id,
    );

    console.log(registeredUser);
    

    const tokens = await this.generateTokens(registeredUser);

    return {
      ...user,
      authentication: { ...tokens },
    };
  }

  /**
   * Social login
   * @param socialLoginDto
   * @returns
   */
  // async socialLogin(socialLoginDto: SocialLoginDto) {
  //   let socialUser: any;
  //   if (socialLoginDto.providerType === ProviderTypes.GOOGLE) {
  //     socialUser = await new SocialiteGoogle().generateUserFromToken(
  //       socialLoginDto.token,
  //     );
  //   }

  //   if (socialLoginDto.providerType === ProviderTypes.APPLE) {
  //     socialUser = await new SocialiteApple(
  //       this.userRepository,
  //     ).generateUserFromToken(socialLoginDto.token);
  //   }

  //   socialUser.email = socialUser.email
  //     ? socialUser.email
  //     : socialLoginDto.email;
  //   socialUser.providerType = socialLoginDto.providerType;

  //   const user = await this.findByProviderTypeAndId(
  //     socialUser.providerType,
  //     socialUser.providerId ? socialUser.providerId : null,
  //   );

  //   socialUser.isSocialLoggedIn = true;

  //   if (!user) {
  //     const newUser = await this.usersService.createOrUpdate({
  //       ...socialUser,
  //       isFirstTimeUser: true,
  //     });
  //     const newTokens = await this.generateTokens(newUser);

  //     return { ...newUser, authentication: { ...newTokens } };
  //   }

  //   const tokens = await this.generateTokens(user);

  //   const newUser = await this.usersService.createOrUpdate(
  //     {
  //       ...user,
  //       isFirstTimeUser: false,
  //     },
  //     user.id,
  //   );
  //   return { ...newUser, authentication: { ...tokens } };
  // }

  /**
   * Find user by provider Id and token
   * @param providerType
   * @param providerId
   */
  // async findByProviderTypeAndId(providerType: string, providerId: string) {
  //   return await this.userRepository.findOne({
  //     where: {
  //       providerType,
  //       providerId,
  //       isBlocked: false,
  //     },
  //   });
  // }

  /**
   * Generate JWT tokens
   * @param user
   * @returns
   */
  async generateTokens(user: Users) {
    const { decodedToken, jwtToken } =
      await this.accessTokensService.createToken(user);

    const refreshToken = await this.refreshTokensService.createToken(
      decodedToken,
    );

    return {
      accessToken: jwtToken,
      refreshToken,
      expiresAt: decodedToken['exp'],
    };
  }

  /**
   * Forgot password
   * @param forgotPasswordDto
   * @returns
   */
  async forgetPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new BadRequestException('This email is not register with us!');
    }

    // if (user.isSocialLoggedIn) {
    //   throw new BadRequestException(
    //     `Provided email address is already associated with ${user.providerType}! Please try to login with ${user.providerType}`,
    //   );
    // }

    const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000);
    const forgotPasswordCodeExpiredAt = moment()
      .add(10, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');

    // Send mail
    // try {
    //   await this.mailerService.sendMail({
    //     to: user.email,
    //     subject: `${this.configService.get('APP_NAME')} app! Forgot password`,
    //     template: 'forgot-password',
    //     context: {
    //       user: user,
    //       forgotPasswordCode: forgotPasswordCode,
    //     },
    //   });
    // } catch (err) {
    //   console.log(err);
    //   throw new BadRequestException(
    //     'Error sending forgot password email. Please try again later',
    //   );
    // }

    await this.usersService.createOrUpdate(
      { forgotPasswordCode, forgotPasswordCodeExpiredAt },
      user.id,
    );
  }

  /**
   * Verify reset password OTP
   * @param verifyResetPasswordOtpDto
   */
  async verifyResetPasswordOtp(
    verifyResetPasswordOtpDto: VerifyResetPasswordOtpDto,
  ) {
    const user = await this.usersService.findByEmailNotSocialLogin(
      verifyResetPasswordOtpDto.email,
    );

    if (!user) {
      throw new BadRequestException('This email is not register with us');
    }

    if (user.forgotPasswordCode !== verifyResetPasswordOtpDto.otp) {
      throw new BadRequestException(
        'Incorrect OTP. Please check your OTP and try again!',
      );
    }

    if (Date.now() > user.forgotPasswordCodeExpiredAt.getTime()) {
      throw new BadRequestException(
        'Password reset code has expired! Please try to send reset password email again',
      );
    }
  }

  /**
   * Reset password
   * @param resetPasswordDto
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmailNotSocialLogin(
      resetPasswordDto.email,
    );

    if (!user) {
      throw new BadRequestException('This email is not register with us');
    }

    await this.usersService.createOrUpdate(
      { password: encodePassword(resetPasswordDto.password) },
      user.id,
    );
  }

  /**
   * Logout user
   * @param user
   */
  async logout(user: Users, logoutDto: LogoutDto) {
    if (logoutDto.deviceId) {
      await this.deviceTokenRepository.delete({ deviceId: logoutDto.deviceId });
    }

    await Promise.all([
      this.accessTokensService.revokeToken(user.jti),
      this.refreshTokensService.revokeTokenUsingJti(user.jti),
    ]);
  }
}
