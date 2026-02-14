"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
dotenv.config();
const AWS = require("aws-sdk");
const fs_1 = require("fs");
const fileupload_helper_1 = require("../../common/helper/fileupload.helper");
const AWS_BUCKET = process.env.AWS_BUCKET;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
let AwsService = class AwsService {
    async uploadFileToS3(file, folder, user) {
        const time = new Date().getTime();
        const folderPath = `${process.env.AWS_FOLDER_NAME}/${user.id}/${folder}`;
        const params = {
            Bucket: AWS_BUCKET,
            Key: `${folderPath}/${time}-${file.originalname}`,
            Body: file.buffer,
        };
        const s3upload = await s3.upload(params).promise();
        return s3upload.Location;
    }
    async uploadVideoToS3(file, folder, user) {
        const time = new Date().getTime();
        const folderPath = `${process.env.AWS_FOLDER_NAME}/${user.id}/${folder}`;
        const params = {
            Bucket: AWS_BUCKET,
            Key: `${folderPath}/${time}-${file.originalname}`,
            Body: file.buffer,
        };
        const { thumbnailPath, videoDuration, thumbnailName } = await (0, fileupload_helper_1.generateThumbnailAndGetMetadata)(file);
        const uploadedThumbnail = await this.uploadToS3FromThumbnailPath(thumbnailPath, thumbnailName, folderPath);
        const s3upload = await s3.upload(params).promise();
        return {
            videoPath: s3upload.Location,
            videoDuration: videoDuration,
            thumbnailPath: uploadedThumbnail,
        };
    }
    async uploadToS3FromThumbnailPath(thumbnail, filename, folderPath) {
        const time = new Date().getTime();
        const fileBuffer = await (0, fileupload_helper_1.convertFileToBuffer)(thumbnail);
        const params = {
            Bucket: AWS_BUCKET,
            Key: `${folderPath}/${time}-${filename}`,
            Body: fileBuffer,
        };
        const s3upload = await s3.upload(params).promise();
        const path = `./${thumbnail}`;
        if ((0, fs_1.existsSync)(path)) {
            (0, fs_1.unlinkSync)(path);
        }
        return s3upload.Location;
    }
    async deleteFromS3(fileArray) {
        const objects = [];
        fileArray.map((file) => {
            if (file != null && file != '') {
                const filename = file.substr(file.lastIndexOf('.com/') + 5);
                objects.push({ Key: filename });
            }
        });
        if (objects.length > 0) {
            const params = {
                Bucket: AWS_BUCKET,
                Delete: {
                    Objects: objects,
                },
            };
            s3.deleteObjects(params, function (_err, _data) {
            });
        }
    }
    async deleteFolderFromS3(folder) {
        try {
            const listObjectsResponse = await s3
                .listObjectsV2({
                Bucket: AWS_BUCKET,
                Prefix: `${process.env.ENVIRONMENT}/${folder}`,
            })
                .promise();
            const objectKeys = listObjectsResponse.Contents.map((obj) => ({
                Key: obj.Key,
            }));
            if (objectKeys.length > 0) {
                await s3
                    .deleteObjects({
                    Bucket: AWS_BUCKET,
                    Delete: { Objects: objectKeys },
                })
                    .promise();
            }
            if (listObjectsResponse.IsTruncated) {
                const lastObjectKey = listObjectsResponse.Contents.slice(-1)[0].Key;
                const nextFolderPath = lastObjectKey.substring(0, lastObjectKey.lastIndexOf('/') + 1);
                await this.deleteFolderFromS3(nextFolderPath);
            }
            await s3
                .deleteObject({
                Bucket: AWS_BUCKET,
                Key: folder,
            })
                .promise();
        }
        catch (error) {
        }
    }
    async copyFolder(sourceFolder, destFolder) {
        const oldFileList = await s3
            .listObjectsV2({ Bucket: AWS_BUCKET, Prefix: destFolder })
            .promise();
        await Promise.all(oldFileList.Contents.map(async (content) => {
            const sourceKey = content.Key;
            await s3.deleteObject({ Bucket: AWS_BUCKET, Key: sourceKey }).promise();
        }));
        const newFileList = await s3
            .listObjectsV2({ Bucket: AWS_BUCKET, Prefix: sourceFolder })
            .promise();
        await Promise.all(newFileList.Contents.map(async (content) => {
            const sourceKey = content.Key;
            const destKey = `${destFolder}/${sourceKey.substring(sourceFolder.length + 1)}`;
            await s3
                .copyObject({
                Bucket: AWS_BUCKET,
                CopySource: `/${AWS_BUCKET}/${sourceKey}`,
                Key: destKey,
            }, async (_err, _data) => {
                await s3
                    .deleteObject({ Bucket: AWS_BUCKET, Key: sourceKey })
                    .promise();
            })
                .promise();
        }));
    }
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = __decorate([
    (0, common_1.Injectable)()
], AwsService);
//# sourceMappingURL=aws.service.js.map