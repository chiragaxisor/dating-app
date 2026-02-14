"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMimeType = exports.decryptMessage = exports.sendPush = exports.isUrlValid = exports.generateUniqueId = exports.numberFormat = exports.generateMeta = exports.formateDate = exports.dateToTimestamp = exports.decrypt = exports.encrypt = void 0;
const crypto_1 = require("crypto");
const moment = require("moment");
const typeorm_1 = require("typeorm");
const app_config_1 = require("../config/app.config");
const encrypt = async (textToEncrypt) => {
    const AES_ENC_KEY_BUFFER = Buffer.from(process.env.AES_ENC_KEY, 'hex');
    const AES_IV_BUFFER = Buffer.from(process.env.AES_IV, 'hex');
    const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', AES_ENC_KEY_BUFFER, AES_IV_BUFFER);
    let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};
exports.encrypt = encrypt;
const decrypt = async (encryptToText) => {
    const AES_ENC_KEY_BUFFER = Buffer.from(process.env.AES_ENC_KEY, 'hex');
    const AES_IV_BUFFER = Buffer.from(process.env.AES_IV, 'hex');
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', AES_ENC_KEY_BUFFER, AES_IV_BUFFER);
    const decrypted = decipher.update(encryptToText, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
};
exports.decrypt = decrypt;
const dateToTimestamp = (date) => {
    return moment.utc(date).unix();
};
exports.dateToTimestamp = dateToTimestamp;
const formateDate = (date, formate = 'DD/MM/YYYY') => {
    return moment.utc(date).format(formate);
};
exports.formateDate = formateDate;
const generateMeta = (data) => {
    const totalItems = Number(data.totalItems);
    return {
        totalItems: totalItems,
        itemsPerPage: data.itemsPerPage,
        totalPages: Math.ceil(totalItems / data.itemsPerPage),
        currentPage: data.currentPage,
    };
};
exports.generateMeta = generateMeta;
const numberFormat = (value, digit) => {
    if (value === undefined)
        return 0;
    return parseFloat(value.toFixed(digit));
};
exports.numberFormat = numberFormat;
const generateUniqueId = async (prefix) => {
    return `${prefix}${(0, crypto_1.randomBytes)(4).toString('hex')}${moment().unix()}`;
};
exports.generateUniqueId = generateUniqueId;
const isUrlValid = (url) => {
    if (typeof url === 'string')
        if (url.indexOf('http') == 0) {
            return true;
        }
        else {
            return false;
        }
    return false;
};
exports.isUrlValid = isUrlValid;
const sendPush = async (tokens, payload) => {
    const appConfig = new app_config_1.AppConfig();
    const connection = new typeorm_1.Connection({
        type: 'mysql',
        host: appConfig.configService.get('DB_HOST'),
        port: appConfig.configService.get('DB_PORT'),
        username: appConfig.configService.get('DB_USERNAME'),
        password: appConfig.configService.get('DB_PASSWORD'),
        database: appConfig.configService.get('DB_DATABASE'),
        entities: ['dist/**/*.entity.js'],
    });
    const myDataSource = connection.connect();
    if (tokens.length > 0) {
    }
};
exports.sendPush = sendPush;
const decryptMessage = (encryptToText) => {
    try {
        const key = Buffer.from(process.env.AES_ENC_KEY_MESSAGE, 'utf-8');
        const iv = Buffer.from(process.env.AES_IV_MESSAGE, 'utf-8');
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptToText, 'base64', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }
    catch (e) {
        console.error(e);
    }
};
exports.decryptMessage = decryptMessage;
const convertMimeType = (file) => {
    const type = file.mimetype.split('/')[0];
    const extension = file.originalname.split('.').pop().toLowerCase();
    return `${type}/${extension}`;
};
exports.convertMimeType = convertMimeType;
//# sourceMappingURL=common.helper.js.map