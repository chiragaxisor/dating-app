"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFileToBuffer = exports.getVideoDuration = exports.generateThumbnailAndGetMetadata = exports.castToPublic = exports.castToStorage = exports.deleteFile = exports.copyFiles = exports.uploadFile = exports.videoFileFilter = exports.docFileFilter = exports.pdfFileFilter = exports.xlsxFileFilter = exports.imageFileFilter = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const app_config_1 = require("../config/app.config");
const constants_1 = require("../constants");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const appConfig = new app_config_1.AppConfig();
const imageFileFilter = (file) => {
    const regExp = /\.(jpg|jpeg|png|gif)$/;
    if (!file.originalname.match(regExp))
        return false;
    else
        return true;
};
exports.imageFileFilter = imageFileFilter;
const xlsxFileFilter = (file) => {
    const regExp = /\.(xlsx)$/;
    if (!file.originalname.match(regExp))
        return false;
    else
        return true;
};
exports.xlsxFileFilter = xlsxFileFilter;
const pdfFileFilter = (file) => {
    const regExp = /\.(pdf)$/;
    if (!file.originalname.match(regExp))
        return false;
    else
        return true;
};
exports.pdfFileFilter = pdfFileFilter;
const docFileFilter = (file) => {
    const regExp = /\.(doc|docx)$/;
    if (!file.originalname.match(regExp))
        return false;
    else
        return true;
};
exports.docFileFilter = docFileFilter;
const videoFileFilter = (file) => {
    const regExp = /\.(mp4|wmv|mov|)$/;
    if (!file.originalname.match(regExp))
        return false;
    else
        return true;
};
exports.videoFileFilter = videoFileFilter;
const uploadFile = (dir, file) => {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    const fileName = `${dir}/${randomName}${(0, path_1.extname)(file.originalname)}`;
    const storageDirExists = (0, fs_1.existsSync)(`/${constants_1.STORAGE_PATH}/`);
    if (!storageDirExists)
        (0, fs_1.mkdirSync)(`${constants_1.STORAGE_PATH}/`, { recursive: true });
    const exists = (0, fs_1.existsSync)(`${constants_1.STORAGE_PATH}/${dir}`);
    if (!exists)
        (0, fs_1.mkdirSync)(`${constants_1.STORAGE_PATH}/${dir}`);
    (0, fs_1.writeFileSync)(`${constants_1.STORAGE_PATH}/${fileName}`, file.buffer);
    return fileName;
};
exports.uploadFile = uploadFile;
const copyFiles = async (dir, files) => {
    const fileNames = await Promise.all(files.map(async (file) => {
        const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        const fileName = `${dir}/${randomName}${(0, path_1.extname)(file.originalname)}`;
        const inStr = fs.createReadStream((0, path_1.join)(__dirname, '../../..', `/public/storage/${file.media}`));
        const outStr = fs.createWriteStream((0, path_1.join)(__dirname, '../../..', `/public/storage/${fileName}`));
        inStr.pipe(outStr);
        return {
            media: fileName,
            mediaType: file.mediaType,
            seconds: file.seconds,
            mediaThumbnail: file.mediaThumbnail,
            originalName: file.originalname,
        };
    }));
    return fileNames;
};
exports.copyFiles = copyFiles;
const deleteFile = (file) => {
    const path = `./${constants_1.STORAGE_PATH}/${file}`;
    if ((0, fs_1.existsSync)(path)) {
        (0, fs_1.unlinkSync)(path);
    }
    return true;
};
exports.deleteFile = deleteFile;
const castToStorage = (file) => {
    return file ? appConfig.storagePath(file) : file;
};
exports.castToStorage = castToStorage;
const castToPublic = (file) => {
    return file ? appConfig.publicPath(file) : file;
};
exports.castToPublic = castToPublic;
const generateThumbnailAndGetMetadata = async (file) => {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    const fileName = `temp/${randomName}${(0, path_1.extname)(file.originalname)}`;
    const storageDirExists = (0, fs_1.existsSync)(`/${constants_1.STORAGE_PATH}/`);
    if (!storageDirExists)
        (0, fs_1.mkdirSync)(`${constants_1.STORAGE_PATH}/`, { recursive: true });
    const exists = (0, fs_1.existsSync)(`${constants_1.STORAGE_PATH}/temp`);
    if (!exists)
        (0, fs_1.mkdirSync)(`${constants_1.STORAGE_PATH}/temp`);
    const storagePath = `${constants_1.STORAGE_PATH}/${fileName}`;
    (0, fs_1.writeFileSync)(storagePath, file.buffer);
    await new Promise((resolve, reject) => {
        ffmpeg(storagePath)
            .on('end', (res) => {
            resolve(res);
        })
            .on('error', (err) => {
            console.error('Error generating thumbnail: ', err);
            reject(err);
        })
            .screenshots({
            count: 1,
            filename: `${randomName}-thumbnail.png`,
            folder: `${constants_1.STORAGE_PATH}/temp`,
            size: '320x180',
        });
    });
    const videoDuration = await (0, exports.getVideoDuration)(storagePath);
    const path = `./${constants_1.STORAGE_PATH}/${fileName}`;
    if ((0, fs_1.existsSync)(path)) {
        (0, fs_1.unlinkSync)(path);
    }
    return {
        thumbnailPath: `${constants_1.STORAGE_PATH}/temp/${randomName}-thumbnail.png`,
        videoDuration: videoDuration,
        thumbnailName: `${randomName}-thumbnail.png`,
    };
};
exports.generateThumbnailAndGetMetadata = generateThumbnailAndGetMetadata;
const getVideoDuration = async (inputFilePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputFilePath, (_error, metadata) => {
            resolve(metadata.format.duration);
            if (_error) {
                reject(_error);
            }
        });
    });
};
exports.getVideoDuration = getVideoDuration;
const convertFileToBuffer = async (inputFilePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile((0, path_1.join)(__dirname, '..', '..', '..', `/${inputFilePath}`), function (err, buffer) {
            if (err) {
                console.log('err', err);
                reject(err);
            }
            resolve(buffer);
            const path = `./${constants_1.STORAGE_PATH}/${inputFilePath}`;
            if ((0, fs_1.existsSync)(path)) {
                (0, fs_1.unlinkSync)(path);
            }
        });
    });
};
exports.convertFileToBuffer = convertFileToBuffer;
//# sourceMappingURL=fileupload.helper.js.map