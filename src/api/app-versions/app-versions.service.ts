import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppVersionsStatus } from 'src/common/constants';
import { Repository } from 'typeorm';
import { AppVersions } from './entities/app-versions.entity';
import { CheckAppVersionDto } from './dto/check-app-version.dto';

@Injectable()
export class AppVersionsService {
  constructor(
    @InjectRepository(AppVersions)
    private appVersionRepo: Repository<AppVersions>,
  ) {}

  /**
   * Check app version
   * @param checkAppVersionDto
   * @returns
   */
  async check(checkAppVersionDto: CheckAppVersionDto) {
    const appVersion = await this.appVersionRepo.findOne({
      where: {
        platform: checkAppVersionDto.platform,
      },
    });

    if (!appVersion) {
      throw new BadRequestException('In app version table data not added.');
    }

    if (
      checkAppVersionDto.version >= appVersion.minVersion &&
      checkAppVersionDto.version < appVersion.latestVersion
    ) {
      return {
        message:
          'You are not using the latest version of the app, please update to the latest version of the app',
        data: { status: AppVersionsStatus.OPTIONAL, link: appVersion.link },
      };
    } else if (checkAppVersionDto.version < appVersion.minVersion) {
      return {
        message:
          'Your app is outdated, please update to the latest version of the app',
        data: { status: AppVersionsStatus.OUTDATED, link: appVersion.link },
      };
    } else {
      return {
        message: 'Your app is up to date',
        data: { status: AppVersionsStatus.UPTODATE, link: appVersion.link },
      };
    }
  }
}
