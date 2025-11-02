import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import * as JWT from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { comparePassword } from 'src/common/helper/bcrypt.helper';

@ApiExcludeController()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private configService: ConfigService,
  ) {}

  /**
   * Login admin
   * @param req
   * @param res
   * @returns
   */
  @Post('/login')
  async login(@Req() req: any, @Res() res: any) {
    const user = await this.adminService.findByEmail(req.body.email);
    if (user) {
      const hashedPasswordMatch = comparePassword(
        req.body.password,
        user.password,
      );
      if (hashedPasswordMatch) {
        const payload = {
          user: user,
        };
        JWT.sign(
          payload,
          this.configService.get('APP_KEY'),
          { expiresIn: 31536000 },
          (err, token) => {
            if (err) {
              console.log(err);
              return res.render('errors/500');
            }
            req.session.token = token;

            return res.status(200).json({
              data: {
                accessToken: token,
                email: user.email,
              },
              message: 'You are successfully logged in',
            });
          },
        );
      } else {
        throw new BadRequestException('Please enter correct password');
      }
    } else {
      throw new BadRequestException('Please enter correct email address');
    }
  }

  /**
   * Change admin password
   * @param req
   * @param res
   * @returns
   */
  @Post('/change-password')
  async changePassword(@Req() req: any, @Res() res: any) {
    await this.adminService.changePassword(req);

    return res.json({
      statusCode: HttpStatus.OK,
      message: 'Password has been changed successfully',
    });
  }

  /**
   * Logout admin
   * @param req
   * @param res
   * @returns
   */
  @Get('/logout')
  async logout(@Req() req: any, @Res() res: any) {
    delete req.session.token;
    return res.redirect('/admin/login');
  }

  /**
   * Dashboard data
   * @param req
   * @param res
   * @returns
   */
  @Get()
  async dashboard(@Req() req: any, @Res() res: any) {
    const data = await this.adminService.dashboardData();

    return res.json({
      data,
    });
  }
}
