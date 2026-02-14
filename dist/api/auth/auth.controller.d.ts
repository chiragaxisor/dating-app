import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Users } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from './dto/verify-reset-password-otp.dto';
import { LogoutDto } from './dto/logout.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Users;
    }>;
    login(loginDto: LoginDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Users;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    verifyResetPasswordOTP(verifyResetPasswordOtpDto: VerifyResetPasswordOtpDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    logout(authUser: Users, logoutDto: LogoutDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
