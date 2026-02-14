import { Users } from '../users/entities/user.entity';
export declare class AwsService {
    uploadFileToS3(file: Express.Multer.File, folder: string, user: Users): Promise<string>;
    uploadVideoToS3(file: Express.Multer.File, folder: string, user: Users): Promise<{
        videoPath: string;
        videoDuration: unknown;
        thumbnailPath: string;
    }>;
    uploadToS3FromThumbnailPath(thumbnail: string, filename: string, folderPath: string): Promise<string>;
    deleteFromS3(fileArray: string[]): Promise<void>;
    deleteFolderFromS3(folder: string): Promise<void>;
    copyFolder(sourceFolder: string, destFolder: string): Promise<void>;
}
