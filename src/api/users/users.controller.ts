import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/common/passport/jwt-auth.guard';
import {
  BAD_REQUEST_RESPONSE,
  CHANGE_PASSWORD_RESPONSE,
  GET_RESPONSE_SUCCESS,
  UNAUTHORIZE_RESPONSE,
  USER_DELETE_PROFILE_RESPONSE,
  USER_RESPONSE,
  USER_UPDATE_PROFILE_RESPONSE,
} from 'src/common/swagger.response';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('api/v1/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UsePipes(ValidationPipe)
@ApiSecurity('api_key', ['Api-Key'])
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Get login user details
   * @param authUser
   * @returns
   */
  @Get('')
  @ApiOperation({
    summary: 'Get login user details',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(USER_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  async userDetails(@AuthUser() authUser: Users) {
    const user: Users = await this.usersService.findById(authUser.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: plainToInstance(Users, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Update user
   * @param authUser
   * @param updateProfileDto
   * @returns
   */
  @Put('')
  @ApiOperation({
    summary: 'Update user details',
    description: `    Gender: male, female, other`,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePic'))
  @HttpCode(HttpStatus.OK)
  @ApiResponse(USER_UPDATE_PROFILE_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  async updateProfile(
    @AuthUser() authUser: Users,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() profilePic: Express.Multer.File,
  ) {
    const user: Users = await this.usersService.updateProfile(
      updateProfileDto,
      authUser,
      profilePic,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Your profile has been successfully updated',
      data: plainToInstance(Users, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Change user password
   * @param authUser
   * @param changePasswordDto
   * @returns
   */
  @Post('change-password')
  @ApiOperation({
    summary: 'Change password',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(CHANGE_PASSWORD_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async changePassword(
    @AuthUser() authUser: Users,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(changePasswordDto, authUser);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password successfully changed',
    };
  }

  /**
   * Delete user
   * @param authUser
   * @returns
   */
  @Delete('')
  @ApiOperation({
    summary: 'Delete user',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(USER_DELETE_PROFILE_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  async deleteProfile(@AuthUser() authUser: Users) {
    await this.usersService.deleteProfile(authUser);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your profile has been successfully deleted',
    };
  }

  /** Toggle user notification
   * @param authUser
   * @returns
   */
  @Get('toggle-notification')
  @ApiOperation({
    summary: 'Toggle notification',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async toggleNotification(@AuthUser() authUser: Users) {
    const user: Users = await this.usersService.toggleNotification(authUser);

    return {
      statusCode: HttpStatus.OK,
      message: `Notification turned ${
        authUser.isNotificationOn ? 'off' : 'on'
      }!`,
      data: plainToInstance(Users, user, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
}
