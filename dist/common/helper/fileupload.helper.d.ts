export declare const imageFileFilter: (file: any) => boolean;
export declare const xlsxFileFilter: (file: any) => boolean;
export declare const pdfFileFilter: (file: any) => boolean;
export declare const docFileFilter: (file: any) => boolean;
export declare const videoFileFilter: (file: any) => boolean;
export declare const uploadFile: (dir: any, file: any) => string;
export declare const copyFiles: (dir: string, files: Array<Express.Multer.File>) => Promise<{
    media: string;
    mediaType: any;
    seconds: any;
    mediaThumbnail: any;
    originalName: any;
}[]>;
export declare const deleteFile: (file: string) => boolean;
export declare const castToStorage: (file: string) => string;
export declare const castToPublic: (file: string) => string;
export declare const generateThumbnailAndGetMetadata: (file: Express.Multer.File) => Promise<{
    thumbnailPath: string;
    videoDuration: unknown;
    thumbnailName: string;
}>;
export declare const getVideoDuration: (inputFilePath: string) => Promise<unknown>;
export declare const convertFileToBuffer: (inputFilePath: string) => Promise<unknown>;
