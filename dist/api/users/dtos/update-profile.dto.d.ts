import { Gender } from 'src/common/constants';
export declare class UpdateProfileDto {
    name: string;
    profilePic: string;
    gender: Gender;
    address: string;
    country: string;
    state: string;
    city: string;
    dateOfBirth: Date;
    imlooking: string;
    relationship: string;
    about: string;
    interested: string;
}
