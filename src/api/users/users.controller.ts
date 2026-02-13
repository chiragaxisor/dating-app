import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
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
  ApiQuery,
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
import { ApproveOrRejectDto } from './dtos/approve-or-reject.dto';
import { GetUserListDto } from './dtos/get-user-list.dto';
import { PurchaseCoinsDto } from './dtos/purchase-coins.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { CoinHistory } from './entities/coin-history.entity';
import { StorePurchase } from './entities/store-purchase.entity';

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
  


  @Get('list')
  @ApiOperation({
    summary: 'Get all user list',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(USER_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  async userlists(@AuthUser() authUser: Users,
    @Query() query: GetUserListDto) {

    const [users, total] = await this.usersService.getUsers(
      query,
      authUser,
    );

    return {
      message: 'Success',
      data: plainToInstance(Users, users, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: query.limit || total,
        totalPages: query.limit ? Math.ceil(Number(total) / query.limit) : 1,
        currentPage: query.page || 1,
      },
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
   * Approve or Reject User
   * @param authUser
   * @param approveOrRejectDto
   * @returns
   */
  @Post('/approve-or-reject')
  @ApiOperation({
    summary: 'Update user details',
    description: `Action type: "approve" or "reject"`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(USER_UPDATE_PROFILE_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  async approveOrRejectUser(
    @AuthUser() authUser: Users,
    @Body() approveOrRejectDto: ApproveOrRejectDto,
  ) {
    const message  = await this.usersService.approveOrRejectUser(
      approveOrRejectDto,
      authUser,
    );

    return {
      statusCode: HttpStatus.OK,
      message: message.message,
    };
  }

  /**
   * Change user password
   * @param authUser
   * @param changePasswordDto
   * @returns
   */
  // @Post('change-password')
  // @ApiOperation({
  //   summary: 'Change password',
  // })
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse(CHANGE_PASSWORD_RESPONSE)
  // @ApiResponse(BAD_REQUEST_RESPONSE)
  // async changePassword(
  //   @AuthUser() authUser: Users,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ) {
  //   await this.usersService.changePassword(changePasswordDto, authUser);

  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Password successfully changed',
  //   };
  // }

  /**
   * Delete user
   * @param authUser
   * @returns
   */
  // @Delete('')
  // @ApiOperation({
  //   summary: 'Delete user',
  // })
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse(USER_DELETE_PROFILE_RESPONSE)
  // @ApiResponse(UNAUTHORIZE_RESPONSE)
  // async deleteProfile(@AuthUser() authUser: Users) {
  //   await this.usersService.deleteProfile(authUser);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Your profile has been successfully deleted',
  //   };
  // }

  /** Toggle user notification
   * @param authUser
   * @returns
   */
  // @Get('toggle-notification')
  // @ApiOperation({
  //   summary: 'Toggle notification',
  // })
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse(GET_RESPONSE_SUCCESS)
  // @ApiResponse(BAD_REQUEST_RESPONSE)
  // async toggleNotification(@AuthUser() authUser: Users) {
  //   const user: Users = await this.usersService.toggleNotification(authUser);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: `Notification turned ${
  //       authUser.isNotificationOn ? 'off' : 'on'
  //     }!`,
  //     data: plainToInstance(Users, user, {
  //       enableImplicitConversion: true,
  //       excludeExtraneousValues: true,
  //     }),
  //   };
  // }
  /**
   * Purchase coins via In-App Purchase
   * @param authUser 
   * @param purchaseCoinsDto 
   * @returns 
   */
  @Post('purchase-coins')
  @ApiOperation({
    summary: 'Purchase coins via In-App Purchase',
    description: `Product IDs: com.dating.coins50, com.dating.coins25`,
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async purchaseCoins(
    @AuthUser() authUser: Users,
    @Body() purchaseCoinsDto: PurchaseCoinsDto,
  ) {
    return await this.usersService.purchaseCoins(purchaseCoinsDto, authUser);
  }

  /**
   * Get user coin transaction history
   * @param authUser 
   * @returns 
   */
  @Get('coin-history')
  @ApiOperation({
    summary: 'Get user coin transaction history',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  async getCoinHistory(@AuthUser() authUser: Users) {
    const history = await this.usersService.getCoinHistory(authUser);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: plainToInstance(CoinHistory, history, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
  @Post('toggle-subscription')
  @ApiOperation({
    summary: 'Toggle Subscription (Simulate iOS subscription purchase)',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  async toggleSubscription(
    @AuthUser() authUser: Users,
    @Body('isSubscribed') isSubscribed: boolean,
  ) {
    return await this.usersService.toggleSubscription(authUser, isSubscribed);
  }

  /**
   * Update subscription from store
   * @param authUser 
   * @param updateSubscriptionDto 
   * @returns 
   */
  @Post('update-subscription')
  @ApiOperation({
    summary: 'Update subscription from App Store/Google Play',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  async updateSubscription(
    @AuthUser() authUser: Users,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.usersService.updateSubscription(updateSubscriptionDto, authUser);
  }

  /**
   * Get store purchase history
   * @param authUser 
   * @returns 
   */
  @Get('purchase-history')
  @ApiOperation({
    summary: 'Get store purchase history (IAP & Subscriptions)',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  async getPurchaseHistory(@AuthUser() authUser: Users) {
    const history = await this.usersService.getPurchaseHistory(authUser);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: plainToInstance(StorePurchase, history, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
}
