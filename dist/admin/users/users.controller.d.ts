import { UsersService } from './users.service';
import { Users } from 'src/api/users/entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAllUsers(search?: string, _page?: string, _limit?: string): Promise<{
        data: Users;
        meta: {
            totalItems: number | Users[];
            itemsPerPage: number | Users[];
            totalPages: number;
            currentPage: number;
        };
    }>;
    blockUnblockUser(id: number): Promise<any>;
}
