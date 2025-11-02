import { HttpStatus } from '@nestjs/common';

const authentication = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4uc25vdy5hZG1pbkBtYWlsaW5hdG9yLmNvbSIsInN1YiI6IjEiLCJqdGkiOiI2YzEzYmNhNTE5MGQ4YWQ3OTU1ZmM1MzRhNjY5MTM3NmYyZWY1NWI3MzRlMmExMjk5NzFlNDU1MzU2MmI4ZTVhIiwiaWF0IjoxNjc2NTM0Mjc0LCJleHAiOjE2Nzg5NTM0NzR9.GbKyURJOhxqScct4LWLt65xuxdJPphYHcFC1ooumH_s',
    },
    refreshToken: {
      type: 'string',
      example:
        'DuAitjb1H/pnML7HTU9cnUruoOFT/K2hntcRNUKksaSBEugMyBu64ZPs+Ux8o3hd',
    },
    expiresAt: {
      type: 'number',
      example: 1678953474,
    },
  },
};

export const meta = {
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
    // itemCount: {
    //   type: 'integer',
    //   example: 1,
    // },
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

export const BAD_REQUEST_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.BAD_REQUEST,
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

export const UNAUTHORIZE_RESPONSE = {
  status: HttpStatus.UNAUTHORIZED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.UNAUTHORIZED },
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
    },
  },
};

export const CONFLICT_RESPONSE = {
  status: HttpStatus.CONFLICT,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.CONFLICT,
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

export const POST_REQUEST_SUCCESS = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.CREATED,
      },
      message: {
        type: 'string',
        example: 'Resource created',
      },
    },
  },
};

export const PUT_REQUEST_SUCCESS = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.OK,
      },
      message: {
        type: 'string',
        example: 'Success',
      },
    },
  },
};

export const GET_RESPONSE_SUCCESS = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.OK,
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
    countryCode: { type: 'string', example: '+91' },
    phone: { type: 'string', example: '9856734589' },
    street: { type: 'string', example: '2464 Royal Ln. Opp Opera' },
    houseNumber: { type: 'string', example: 'House number A' },
    houseNumberExtension: { type: 'string', example: '12' },
    country: { type: 'string', example: 'United States' },
    city: { type: 'string', example: 'Los Angeles' },
    postalCode: { type: 'string', example: '45463' },
    latitude: { type: 'number', example: 21.12 },
    longitude: { type: 'number', example: 72.78 },
    age: { type: 'number', example: 30 },
    gender: { type: 'string', example: 'male' },
    profilePic: {
      type: 'string',
      example:
        'http://localhost:3017/storage/profilePics/c3fdaa18313d7683b385b5329f18e8ed.png',
    },
    ratings: { type: 'number', example: 0 },
    isSocialLoggedIn: { type: 'boolean', example: false },
    isFirstTimeUser: { type: 'boolean', example: false },
    isNotificationOn: { type: 'boolean', example: false },
    createdAt: { type: 'number', example: 1676049232 },
  },
};

export const USER_REGISTRATION_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'A confirmation email has been sent to your email address',
      },
    },
  },
};

export const USER_LOGIN_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
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

export const USER_LOGOUT_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: { type: 'string', example: 'You are successfully logged out' },
    },
  },
};

export const USER_DELETE_PROFILE_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example: 'Your profile has been successfully deleted',
      },
    },
  },
};

export const USER_EXISTS_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.BAD_REQUEST,
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

export const INVALID_USER_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.BAD_REQUEST,
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

export const USER_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Success' },
      data: user,
    },
  },
};

export const USER_UPDATE_PROFILE_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'Your profile has been successfully updated',
      },
      data: user,
    },
  },
};

export const CHECK_APP_VERSION_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
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

export const CHANGE_PASSWORD_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: { type: 'string', example: 'Password successfully changed' },
    },
  },
};

export const FORGOT_PASSWORD_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example:
          'A authentication code has been sent to your registered email address',
      },
    },
  },
};

export const VERIFY_RESET_PASSWORD_OTP_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'OTP has been successfully verified',
      },
    },
  },
};

export const RESET_PASSWORD_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'Password has been successfully changed',
      },
    },
  },
};

export const REGISTER_DEVICE_TOKEN_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'Device token registered successfully',
      },
    },
  },
};

export const SEND_PUSH_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: {
        type: 'string',
        example: 'Notification successfully sent',
      },
    },
  },
};
