import { IPaginationMeta } from 'nestjs-typeorm-paginate';
export declare const encrypt: (textToEncrypt: string) => Promise<string>;
export declare const decrypt: (encryptToText: string) => Promise<string>;
export declare const dateToTimestamp: (date: string) => number;
export declare const formateDate: (date: any, formate?: string) => string;
export declare const generateMeta: (data: Partial<IPaginationMeta>) => {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};
export declare const numberFormat: (value: number, digit: number) => number;
export declare const generateUniqueId: (prefix: string) => Promise<string>;
export declare const isUrlValid: (url: any) => boolean;
export declare const sendPush: (tokens: string[], payload: {
    notification: {
        title: string;
        body: string;
    };
    data: any;
}) => Promise<void>;
export declare const decryptMessage: (encryptToText: string) => string;
export declare const convertMimeType: (file: Express.Multer.File) => string;
