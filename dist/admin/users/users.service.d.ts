import { Users } from 'src/api/users/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<Users>);
    findAllUsers(search: string, page: number, limit: number): Promise<(number | Users[])[]>;
    blockUnblockUser(id: number): Promise<Users>;
}
