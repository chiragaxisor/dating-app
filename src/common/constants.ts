import * as dotenv from 'dotenv';
dotenv.config();

export const STORAGE_PATH = 'public/storage';

export enum DeviceTypes {
  ANDROID = 'Android',
  IOS = 'iOS',
  WEB = 'Web',
}

export enum NotificationTypes {
  DEFAULT_NOTIFICATION = 0,
  STATUS_UPDATE_ACTIVE_ORDERS = 1,
  STATUS_UPDATE_ORDER_HISTORY = 2,
  STATUS_UPDATE_BOOKING_REQUESTS = 3,
  CHAT = 4,
}

export enum ProviderTypes {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
}

export enum AccountDeleteType {
  TEMPORARY_DELETE = 'temporary',
  PERMANENT_DELETE = 'permanent',
}

export enum AppVersionsStatus {
  UPTODATE = 0,
  OUTDATED = 1,
  OPTIONAL = 2,
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MediaTypes {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  DOCUMENT = 'doc',
}

export const DEFAULT_FIXED_VALUE = 2;

export enum MessageTypes {
  TEXT = 'text',
  IMAGE = 'images',
}


