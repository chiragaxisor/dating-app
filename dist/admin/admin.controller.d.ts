import { AdminService } from './admin.service';
import { ConfigService } from '@nestjs/config';
export declare class AdminController {
    private readonly adminService;
    private configService;
    constructor(adminService: AdminService, configService: ConfigService);
    login(req: any, res: any): Promise<void>;
    changePassword(req: any, res: any): Promise<any>;
    logout(req: any, res: any): Promise<any>;
    dashboard(req: any, res: any): Promise<any>;
}
