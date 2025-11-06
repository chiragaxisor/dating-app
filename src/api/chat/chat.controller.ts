import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { ChatJoinDto } from './dto/chat-join.dto';
import { ChatService } from './chat.service';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadDto } from './dto/image-upload.dto';
import { ChatMessageResponse } from './resources/chat-message.response';
import {
  BAD_REQUEST_RESPONSE,
  GET_RESPONSE_SUCCESS,
  POST_REQUEST_SUCCESS,
} from 'src/common/swagger.response';
import { Users } from '../users/entities/user.entity';
import { imageFileFilter } from 'src/common/helper/fileupload.helper';
import { JwtAuthGuard } from 'src/common/passport/jwt-auth.guard';
import { Chat } from './entities/chat.entity';
import { ImageUploadResource } from './resources/image-upload.response';
// import { Languages } from 'src/common/constants';
// import { AwsService } from '../aws/aws.service';
import {
  convertMimeType,
  // getS3BucketPath,
} from 'src/common/helper/common.helper';

@ApiTags('Chat')  
@Controller('api/v1/chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UsePipes(ValidationPipe)
export class ChatController {
  constructor(
    private chatService: ChatService,
    // private awsService: AwsService,
  ) {}

  /**
   * Chat list
   * @param authUser
   * @param limit
   * @param page
   * @param search
   * @returns
   */
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOperation({
    summary: 'Chat List',
  })
  @Get('/list')
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @HttpCode(HttpStatus.OK)
  async chatList(
    @AuthUser() authUser: Users,
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
    @Query('search') search?: string,
  ) {
    const page = Number(_page) || 1;
    const limit = Number(_limit);

    const [data, total] = await this.chatService.chatList(
      authUser,
      page,
      limit,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched chat list.',
      data: plainToInstance(Chat, data, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit ? limit : total,
        totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
        currentPage: page ? page : 1,
      },
    };
  }

  /**
   * Chat Upload Image
   * @param authUser
   * @param imageUploadDto
   * @param files
   * @param i18n
   * @returns
   */
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiOperation({
    summary: 'Image Upload',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/upload-image')
  async uploadImage(
    @AuthUser() authUser: Users,
    @Body() imageUploadDto: ImageUploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    let data = '';
    // files?.map(async (item: any) => {
    //   if (item.fieldname === 'images') {
    //     if (!imageFileFilter(item)) {
    //       throw new BadRequestException(
    //         i18n.t('exception.BAD_REQUEST.ONLY_IMAGES_ALLOWED'),
    //       );
    //     }
    //   }
    //   data.push(uploadFile('chat', item));
    // });

    if (file) {
      if (file.fieldname === 'image') {
        if (!imageFileFilter(file)) {
          throw new BadRequestException(
            'Erroer',
          );
        }
      }

      // data = uploadFile('chat', file);
      // data = await this.awsService.uploadToS3(
      //   file,
      //   getS3BucketPath(authUser, `chats/${imageUploadDto.chatId}`),
      //   convertMimeType(file),
      // );
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Image uploaded successfully.',
      data: plainToInstance(ImageUploadResource, data, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Join chat room
   * @param authUser
   * @param chatJoinDto
   * @param i18n
   * @returns
   */
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiOperation({
    summary: 'Join chat room',
  })
  @Post('/join')
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @HttpCode(HttpStatus.CREATED)
  
  async joinRoom(
    @AuthUser() authUser: Users,
    @Body() chatJoinDto: ChatJoinDto
  ) {
    const data = await this.chatService.joinRoom(authUser, chatJoinDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully joined chat room.',
      data: plainToInstance(Chat, data, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }

  /**
   * Get Chat Messages
   * @param authUser
   * @param chatId
   * @param limit
   * @param page
   * @returns
   */
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({
    summary: 'Chat Messages',
  })
  @Get('/:chatId')
  async getChatMessages(
    @AuthUser() authUser: Users,
    @Param('chatId') chatId: number,
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
  ) {
    const page = Number(_page) || 1;
    const limit = Number(_limit);

    // const data = this.chatService.chatMessageList(chatId, limit, skip);
    // return { data: await classToPlain('data') };
    
    const [chat, total] = await this.chatService.chatMessageList(
      chatId,
      authUser,
      limit,
      page,
    );

    return {
      data: plainToInstance(ChatMessageResponse, chat, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit ? limit : total,
        totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
        currentPage: page ? page : 1,
      },
    };
  }

  /**
   * Get Active Users
   * @param authUser
   * @param limit
   * @param page
   * @returns
   */
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiOperation({
    summary: 'Active Users List',
  })
  @Get('/active-users/list')
  async getActiveUsers(
    @AuthUser() authUser: Users,
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
  ) {
    const page = Number(_page) || 1;
    const limit = Number(_limit);

    const [chatUsers, total] = await this.chatService.getActiveUsers(
      authUser,
      limit,
      page,
    );

    return {
      data: plainToInstance(Users, chatUsers, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
      meta: {
        totalItems: total,
        itemsPerPage: limit ? limit : total,
        totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
        currentPage: page ? page : 1,
      },
    };
  }

  /**
   * Clear chat
   * @param chatId
   * @param i18n
   * @returns
   */
  @Delete(':chatId')
  @ApiOperation({
    summary: 'Clear chat',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  
  async clearChat(
    @AuthUser() authUser: Users,
    @Param('chatId') chatId: number,
  ) {
    await this.chatService.clearChat(chatId, authUser);

    return {
      statusCode: HttpStatus.OK,
      message: 'Chat cleared successfully.',
    };
  }
}
