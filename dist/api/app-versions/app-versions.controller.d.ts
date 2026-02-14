import { HttpStatus } from '@nestjs/common';
import { AppVersionsService } from './app-versions.service';
import { CheckAppVersionDto } from './dto/check-app-version.dto';
export declare class AppVersionsController {
    private readonly appVersionsService;
    constructor(appVersionsService: AppVersionsService);
    checkVersion(checkAppVersionDto: CheckAppVersionDto): Promise<{
        message: string;
        data: {
            status: import("../../common/constants").AppVersionsStatus;
            link: string;
        };
        statusCode: HttpStatus;
    }>;
}
