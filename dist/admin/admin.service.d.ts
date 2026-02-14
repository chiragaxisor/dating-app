import { Users } from 'src/api/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Admins } from './admin.entity';
export declare class AdminService {
    private readonly adminRepository;
    private readonly usersRepository;
    constructor(adminRepository: Repository<Admins>, usersRepository: Repository<Users>);
    findByEmail(email: string): Promise<Admins>;
    dashboardData(): Promise<{
        totalUsers: number;
        registeredThisMonthUsers: number;
        usersGraphData: any[];
    }>;
    changePassword(req: any): Promise<void>;
}
