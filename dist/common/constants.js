"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImLookingType = exports.RelationshipType = exports.MessageTypes = exports.DEFAULT_FIXED_VALUE = exports.MediaTypes = exports.Gender = exports.AppVersionsStatus = exports.AccountDeleteType = exports.ProviderTypes = exports.NotificationTypes = exports.DeviceTypes = exports.STORAGE_PATH = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.STORAGE_PATH = 'public/storage';
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes["ANDROID"] = "Android";
    DeviceTypes["IOS"] = "iOS";
    DeviceTypes["WEB"] = "Web";
})(DeviceTypes || (exports.DeviceTypes = DeviceTypes = {}));
var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes[NotificationTypes["DEFAULT_NOTIFICATION"] = 0] = "DEFAULT_NOTIFICATION";
    NotificationTypes[NotificationTypes["STATUS_UPDATE_ACTIVE_ORDERS"] = 1] = "STATUS_UPDATE_ACTIVE_ORDERS";
    NotificationTypes[NotificationTypes["STATUS_UPDATE_ORDER_HISTORY"] = 2] = "STATUS_UPDATE_ORDER_HISTORY";
    NotificationTypes[NotificationTypes["STATUS_UPDATE_BOOKING_REQUESTS"] = 3] = "STATUS_UPDATE_BOOKING_REQUESTS";
    NotificationTypes[NotificationTypes["CHAT"] = 4] = "CHAT";
})(NotificationTypes || (exports.NotificationTypes = NotificationTypes = {}));
var ProviderTypes;
(function (ProviderTypes) {
    ProviderTypes["GOOGLE"] = "google";
    ProviderTypes["APPLE"] = "apple";
    ProviderTypes["FACEBOOK"] = "facebook";
})(ProviderTypes || (exports.ProviderTypes = ProviderTypes = {}));
var AccountDeleteType;
(function (AccountDeleteType) {
    AccountDeleteType["TEMPORARY_DELETE"] = "temporary";
    AccountDeleteType["PERMANENT_DELETE"] = "permanent";
})(AccountDeleteType || (exports.AccountDeleteType = AccountDeleteType = {}));
var AppVersionsStatus;
(function (AppVersionsStatus) {
    AppVersionsStatus[AppVersionsStatus["UPTODATE"] = 0] = "UPTODATE";
    AppVersionsStatus[AppVersionsStatus["OUTDATED"] = 1] = "OUTDATED";
    AppVersionsStatus[AppVersionsStatus["OPTIONAL"] = 2] = "OPTIONAL";
})(AppVersionsStatus || (exports.AppVersionsStatus = AppVersionsStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["IMAGE"] = "image";
    MediaTypes["VIDEO"] = "video";
    MediaTypes["PDF"] = "pdf";
    MediaTypes["DOCUMENT"] = "doc";
})(MediaTypes || (exports.MediaTypes = MediaTypes = {}));
exports.DEFAULT_FIXED_VALUE = 2;
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["TEXT"] = "text";
    MessageTypes["IMAGE"] = "images";
    MessageTypes["STICKER"] = "sticker";
})(MessageTypes || (exports.MessageTypes = MessageTypes = {}));
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["DATING"] = "Dating";
    RelationshipType["CASUAL"] = "Casual";
    RelationshipType["SERIOUS_RELATIONSHIP"] = "Serious Relationship";
    RelationshipType["FRIENDSHIP"] = "Friendship";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
var ImLookingType;
(function (ImLookingType) {
    ImLookingType["YOUNGER_MEN"] = "Younger Men";
    ImLookingType["BOYS_18_PLUS"] = "Boys (18+)";
    ImLookingType["MEN_OF_ANY_AGE"] = "Men of Any Age";
    ImLookingType["OLDER_WOMEN"] = "Older Women";
    ImLookingType["WOMEN_OF_ANY_AGE"] = "Women of Any Age";
    ImLookingType["MATURE_WOMEN_35_PLUS"] = "Mature Women (35+)";
})(ImLookingType || (exports.ImLookingType = ImLookingType = {}));
//# sourceMappingURL=constants.js.map