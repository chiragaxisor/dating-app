import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { AppConfig } from '../config/app.config';
import { STORAGE_PATH } from '../constants';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

const appConfig = new AppConfig();

/**
 * Filter image
 * @param file
 * @returns
 */
export const imageFileFilter = (file) => {
  const regExp = /\.(jpg|jpeg|png|gif)$/;
  if (!file.originalname.match(regExp)) return false;
  else return true;
};

/**
 * Filter xlsx file
 * @param file
 * @returns
 */
export const xlsxFileFilter = (file) => {
  const regExp = /\.(xlsx)$/;
  if (!file.originalname.match(regExp)) return false;
  else return true;
};

/**
 * Filter pdf file
 * @param file
 * @returns
 */
export const pdfFileFilter = (file) => {
  const regExp = /\.(pdf)$/;
  if (!file.originalname.match(regExp)) return false;
  else return true;
};

/**
 * Filter document file
 * @param file
 * @returns
 */
export const docFileFilter = (file) => {
  const regExp = /\.(doc|docx)$/;
  if (!file.originalname.match(regExp)) return false;
  else return true;
};

/**
 * Filter video file
 * @param file
 * @returns
 */
export const videoFileFilter = (file) => {
  const regExp = /\.(mp4|wmv|mov|)$/;
  if (!file.originalname.match(regExp)) return false;
  else return true;
};

/**
 * Upload file
 * @param dir
 * @param file
 * @returns
 */
export const uploadFile = (dir: any, file: any) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const fileName = `${dir}/${randomName}${extname(file.originalname)}`;

  const storageDirExists = existsSync(`/${STORAGE_PATH}/`);
  if (!storageDirExists) mkdirSync(`${STORAGE_PATH}/`, { recursive: true });

  const exists = existsSync(`${STORAGE_PATH}/${dir}`);
  if (!exists) mkdirSync(`${STORAGE_PATH}/${dir}`);

  writeFileSync(`${STORAGE_PATH}/${fileName}`, file.buffer);

  return fileName;
};

/**
 * Copy files
 * @param dir
 * @param files
 * @returns
 */
export const copyFiles = async (
  dir: string,
  files: Array<Express.Multer.File>,
) => {
  const fileNames = await Promise.all(
    files.map(async (file: any) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      const fileName = `${dir}/${randomName}${extname(file.originalname)}`;

      const inStr = fs.createReadStream(
        join(__dirname, '../../..', `/public/storage/${file.media}`),
      );
      const outStr = fs.createWriteStream(
        join(__dirname, '../../..', `/public/storage/${fileName}`),
      );

      inStr.pipe(outStr);

      return {
        media: fileName,
        mediaType: file.mediaType,
        seconds: file.seconds,
        mediaThumbnail: file.mediaThumbnail,
        originalName: file.originalname,
      };
    }),
  );
  return fileNames;
};

/**
 * Delete file
 * @param {string} file
 * @returns
 */
export const deleteFile = (file: string) => {
  const path = `./${STORAGE_PATH}/${file}`;
  if (existsSync(path)) {
    unlinkSync(path);
  }
  return true;
};

/**
 * Get storage url
 * @param file
 * @returns
 */
export const castToStorage = (file: string) => {
  return file ? appConfig.storagePath(file) : file;
};

/**
 * get public url
 * @param file
 * @returns
 */
export const castToPublic = (file: string) => {
  return file ? appConfig.publicPath(file) : file;
};

/**
 * Generate Thumbnail and get metadata
 * @param file
 * @returns
 */
export const generateThumbnailAndGetMetadata = async (
  file: Express.Multer.File,
) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  const fileName = `temp/${randomName}${extname(file.originalname)}`;

  const storageDirExists = existsSync(`/${STORAGE_PATH}/`);
  if (!storageDirExists) mkdirSync(`${STORAGE_PATH}/`, { recursive: true });

  const exists = existsSync(`${STORAGE_PATH}/temp`);
  if (!exists) mkdirSync(`${STORAGE_PATH}/temp`);

  const storagePath = `${STORAGE_PATH}/${fileName}`;

  writeFileSync(storagePath, file.buffer);

  // Generate thumbnail using ffmpeg

  await new Promise((resolve, reject) => {
    ffmpeg(storagePath)
      .on('end', (res) => {
        // console.log('done');
        resolve(res);
      })
      .on('error', (err) => {
        console.error('Error generating thumbnail: ', err);
        reject(err);
      })
      .screenshots({
        count: 1,
        filename: `${randomName}-thumbnail.png`,
        folder: `${STORAGE_PATH}/temp`,
        size: '320x180',
      });
  });

  const videoDuration = await getVideoDuration(storagePath);

  const path = `./${STORAGE_PATH}/${fileName}`;
  if (existsSync(path)) {
    unlinkSync(path);
  }

  return {
    thumbnailPath: `${STORAGE_PATH}/temp/${randomName}-thumbnail.png`,
    videoDuration: videoDuration,
    thumbnailName: `${randomName}-thumbnail.png`,
  };
};

/**
 * Get video duration
 * @param inputFilePath
 * @returns
 */
export const getVideoDuration = async (inputFilePath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputFilePath, (_error: any, metadata: any) => {
      resolve(metadata.format.duration);

      if (_error) {
        reject(_error);
      }
    });
  });
};

/**
 * Convert file to buffer
 * @param inputFilePath
 * @returns
 */
export const convertFileToBuffer = async (inputFilePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      join(__dirname, '..', '..', '..', `/${inputFilePath}`),
      function (err, buffer) {
        if (err) {
          console.log('err', err);
          reject(err);
        }

        resolve(buffer);

        const path = `./${STORAGE_PATH}/${inputFilePath}`;
        if (existsSync(path)) {
          unlinkSync(path);
        }
      },
    );
  });
};
