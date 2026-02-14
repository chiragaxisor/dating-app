"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEND_PUSH_RESPONSE = exports.REGISTER_DEVICE_TOKEN_RESPONSE = exports.RESET_PASSWORD_RESPONSE = exports.VERIFY_RESET_PASSWORD_OTP_RESPONSE = exports.FORGOT_PASSWORD_RESPONSE = exports.CHANGE_PASSWORD_RESPONSE = exports.CHECK_APP_VERSION_RESPONSE = exports.USER_UPDATE_PROFILE_RESPONSE = exports.USER_RESPONSE = exports.INVALID_USER_RESPONSE = exports.USER_EXISTS_RESPONSE = exports.USER_DELETE_PROFILE_RESPONSE = exports.USER_LOGOUT_RESPONSE = exports.USER_LOGIN_RESPONSE = exports.USER_REGISTRATION_RESPONSE = exports.GET_RESPONSE_SUCCESS = exports.PUT_REQUEST_SUCCESS = exports.POST_REQUEST_SUCCESS = exports.CONFLICT_RESPONSE = exports.UNAUTHORIZE_RESPONSE = exports.BAD_REQUEST_RESPONSE = exports.meta = void 0;
const common_1 = require("@nestjs/common");
const authentication = {
    type: 'object',
    properties: {
        accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4uc25vdy5hZG1pbkBtYWlsaW5hdG9yLmNvbSIsInN1YiI6IjEiLCJqdGkiOiI2YzEzYmNhNTE5MGQ4YWQ3OTU1ZmM1MzRhNjY5MTM3NmYyZWY1NWI3MzRlMmExMjk5NzFlNDU1MzU2MmI4ZTVhIiwiaWF0IjoxNjc2NTM0Mjc0LCJleHAiOjE2Nzg5NTM0NzR9.GbKyURJOhxqScct4LWLt65xuxdJPphYHcFC1ooumH_s',
        },
        refreshToken: {
            type: 'string',
            example: 'DuAitjb1H/pnML7HTU9cnUruoOFT/K2hntcRNUKksaSBEugMyBu64ZPs+Ux8o3hd',
        },
        expiresAt: {
            type: 'number',
            example: 1678953474,
        },
    },
};
exports.meta = {
    type: 'object',
    properties: {
        totalItems: {
            type: 'integer',
            example: 10,
        },
        itemsPerPage: {
            type: 'integer',
            example: 1,
        },
        totalPages: {
            type: 'integer',
            example: 1,
        },
        currentPage: {
            type: 'integer',
            example: 1,
        },
    },
};
exports.BAD_REQUEST_RESPONSE = {
    status: common_1.HttpStatus.BAD_REQUEST,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.BAD_REQUEST,
            },
            message: {
                type: 'string',
                example: 'error message',
            },
            error: {
                type: 'string',
                example: 'Bad Request',
            },
        },
    },
};
exports.UNAUTHORIZE_RESPONSE = {
    status: common_1.HttpStatus.UNAUTHORIZED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.UNAUTHORIZED },
            message: {
                type: 'string',
                example: 'Unauthorized',
            },
        },
    },
};
exports.CONFLICT_RESPONSE = {
    status: common_1.HttpStatus.CONFLICT,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.CONFLICT,
            },
            message: {
                type: 'string',
                example: 'Conflict error message',
            },
            error: {
                type: 'string',
                example: 'Conflict',
            },
        },
    },
};
exports.POST_REQUEST_SUCCESS = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.CREATED,
            },
            message: {
                type: 'string',
                example: 'Resource created',
            },
        },
    },
};
exports.PUT_REQUEST_SUCCESS = {
    status: common_1.HttpStatus.OK,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.OK,
            },
            message: {
                type: 'string',
                example: 'Success',
            },
        },
    },
};
exports.GET_RESPONSE_SUCCESS = {
    status: common_1.HttpStatus.OK,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.OK,
            },
            message: {
                type: 'string',
                example: 'Success',
            },
        },
    },
};
const user = {
    type: 'object',
    properties: {
        id: { type: 'number', example: 1 },
        userUniqueId: {
            type: 'string',
            example: 'U47e6f7751685758978',
        },
        name: { type: 'string', example: 'Aman Verma' },
        email: { type: 'string', example: 'aman@mailinator.com' },
        gender: { type: 'string', example: 'male' },
        createdAt: { type: 'number', example: 1676049232 },
    },
};
exports.USER_REGISTRATION_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'A confirmation email has been sent to your email address',
            },
        },
    },
};
exports.USER_LOGIN_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: { type: 'string', example: 'You are successfully logged in' },
            data: {
                type: 'object',
                properties: {
                    ...user.properties,
                    authentication: authentication,
                },
            },
        },
    },
};
exports.USER_LOGOUT_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: { type: 'string', example: 'You are successfully logged out' },
        },
    },
};
exports.USER_DELETE_PROFILE_RESPONSE = {
    status: common_1.HttpStatus.OK,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.OK },
            message: {
                type: 'string',
                example: 'Your profile has been successfully deleted',
            },
        },
    },
};
exports.USER_EXISTS_RESPONSE = {
    status: common_1.HttpStatus.BAD_REQUEST,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.BAD_REQUEST,
            },
            message: {
                type: 'string',
                example: 'This email is already registered with us',
            },
            error: {
                type: 'string',
                example: 'Bad Request',
            },
        },
    },
};
exports.INVALID_USER_RESPONSE = {
    status: common_1.HttpStatus.BAD_REQUEST,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: {
                type: 'number',
                example: common_1.HttpStatus.BAD_REQUEST,
            },
            message: {
                type: 'string',
                example: 'This email is not registered with us. Please register first!',
            },
            error: {
                type: 'string',
                example: 'Bad Request',
            },
        },
    },
};
exports.USER_RESPONSE = {
    status: common_1.HttpStatus.OK,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.OK },
            message: { type: 'string', example: 'Success' },
            data: user,
        },
    },
};
exports.USER_UPDATE_PROFILE_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'Your profile has been successfully updated',
            },
            data: user,
        },
    },
};
exports.CHECK_APP_VERSION_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: { type: 'string', example: 'Your app is up to date' },
            data: {
                type: 'object',
                properties: {
                    status: { type: 'number', example: 0 },
                    link: {
                        type: 'string',
                        example: 'https://apps.apple.com/in/app/loosh/id1147396723?mt=12',
                    },
                },
            },
        },
    },
};
exports.CHANGE_PASSWORD_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: { type: 'string', example: 'Password successfully changed' },
        },
    },
};
exports.FORGOT_PASSWORD_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'A authentication code has been sent to your registered email address',
            },
        },
    },
};
exports.VERIFY_RESET_PASSWORD_OTP_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'OTP has been successfully verified',
            },
        },
    },
};
exports.RESET_PASSWORD_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'Password has been successfully changed',
            },
        },
    },
};
exports.REGISTER_DEVICE_TOKEN_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'Device token registered successfully',
            },
        },
    },
};
exports.SEND_PUSH_RESPONSE = {
    status: common_1.HttpStatus.CREATED,
    schema: {
        type: 'object',
        description: 'Response',
        properties: {
            statusCode: { type: 'number', example: common_1.HttpStatus.CREATED },
            message: {
                type: 'string',
                example: 'Notification successfully sent',
            },
        },
    },
};
//# sourceMappingURL=swagger.response.js.map