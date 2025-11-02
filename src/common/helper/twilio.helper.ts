import { BadRequestException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import * as twilio from 'twilio';

/**
 * Send Twilio SMS to phone number
 * @param phone
 * @param body
 * @returns
 */
export const sendSms = async (phone: string, body: string) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

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

      throw new BadRequestException('Invalid phone number');
    });
};

/**
 * Validate phone number
 * @param phone
 * @returns
 */
export const isPhoneNumverValid = async (phone: string) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

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
  } catch (error) {
    return false;
  }
};
