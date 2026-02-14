import { AppVersionsStatus } from 'src/common/constants';
import { Repository } from 'typeorm';
import { AppVersions } from './entities/app-versions.entity';
import { CheckAppVersionDto } from './dto/check-app-version.dto';
export declare class AppVersionsService {
    private appVersionRepo;
    constructor(appVersionRepo: Repository<AppVersions>);
    check(checkAppVersionDto: CheckAppVersionDto): Promise<{
        message: string;
        data: {
            status: AppVersionsStatus;
            link: string;
        };
    }>;
}
