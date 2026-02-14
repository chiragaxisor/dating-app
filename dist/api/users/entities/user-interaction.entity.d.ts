import { Users } from './user.entity';
export declare enum InteractionType {
    APPROVE = "approve",
    REJECT = "reject"
}
export declare class UserInteraction {
    id: number;
    user: Users;
    actionBy: Users;
    actionType: InteractionType;
    createdAt: Date;
    updatedAt: Date;
}
