import { ImLookingType, RelationshipType } from 'src/common/constants';
export declare class GetUserListDto {
    search?: string;
    page?: number;
    limit?: number;
    relationship?: RelationshipType;
    imlooking?: ImLookingType;
}
