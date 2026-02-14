"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPhoneNumverValid = exports.sendSms = void 0;
const common_1 = require("@nestjs/common");
require('dotenv').config();
const twilio = require("twilio");
const sendSms = async (phone, body) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages
        .create({
        body: body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    })
        .then((response) => {
        console.log(response);
    })
        .catch((error) => {
        console.log(error);
        throw new common_1.BadRequestException('Invalid phone number');
    });
};
exports.sendSms = sendSms;
const isPhoneNumverValid = async (phone) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        return await client.lookups.v1
            .phoneNumbers(phone)
            .fetch()
            .then(() => {
            return true;
        })
            .catch(() => {
            return false;
        });
    }
    catch (error) {
        return false;
    }
};
exports.isPhoneNumverValid = isPhoneNumverValid;
//# sourceMappingURL=twilio.helper.js.map