import { Users } from 'src/api/users/entities/user.entity';
export declare enum TransactionType {
    PURCHASE = "purchase",
    SPENT = "spent"
}
export declare class CoinHistory {
    id: number;
    user: Users;
    coins: number;
    type: TransactionType;
    description: string;
    productId: string;
    transactionId: string;
    createdAt: Date;
}
