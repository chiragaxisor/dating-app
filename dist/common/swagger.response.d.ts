import { HttpStatus } from '@nestjs/common';
export declare const meta: {
    type: string;
    properties: {
        totalItems: {
            type: string;
            example: number;
        };
        itemsPerPage: {
            type: string;
            example: number;
        };
        totalPages: {
            type: string;
            example: number;
        };
        currentPage: {
            type: string;
            example: number;
        };
    };
};
export declare const BAD_REQUEST_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            error: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const UNAUTHORIZE_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const CONFLICT_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            error: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const POST_REQUEST_SUCCESS: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const PUT_REQUEST_SUCCESS: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const GET_RESPONSE_SUCCESS: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const USER_REGISTRATION_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const USER_LOGIN_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            data: {
                type: string;
                properties: {
                    authentication: {
                        type: string;
                        properties: {
                            accessToken: {
                                type: string;
                                example: string;
                            };
                            refreshToken: {
                                type: string;
                                example: string;
                            };
                            expiresAt: {
                                type: string;
                                example: number;
                            };
                        };
                    };
                    id: {
                        type: string;
                        example: number;
                    };
                    userUniqueId: {
                        type: string;
                        example: string;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        example: string;
                    };
                    gender: {
                        type: string;
                        example: string;
                    };
                    createdAt: {
                        type: string;
                        example: number;
                    };
                };
            };
        };
    };
};
export declare const USER_LOGOUT_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const USER_DELETE_PROFILE_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const USER_EXISTS_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            error: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const INVALID_USER_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            error: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const USER_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            data: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        example: number;
                    };
                    userUniqueId: {
                        type: string;
                        example: string;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        example: string;
                    };
                    gender: {
                        type: string;
                        example: string;
                    };
                    createdAt: {
                        type: string;
                        example: number;
                    };
                };
            };
        };
    };
};
export declare const USER_UPDATE_PROFILE_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            data: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        example: number;
                    };
                    userUniqueId: {
                        type: string;
                        example: string;
                    };
                    name: {
                        type: string;
                        example: string;
                    };
                    email: {
                        type: string;
                        example: string;
                    };
                    gender: {
                        type: string;
                        example: string;
                    };
                    createdAt: {
                        type: string;
                        example: number;
                    };
                };
            };
        };
    };
};
export declare const CHECK_APP_VERSION_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
            data: {
                type: string;
                properties: {
                    status: {
                        type: string;
                        example: number;
                    };
                    link: {
                        type: string;
                        example: string;
                    };
                };
            };
        };
    };
};
export declare const CHANGE_PASSWORD_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const FORGOT_PASSWORD_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const VERIFY_RESET_PASSWORD_OTP_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const RESET_PASSWORD_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const REGISTER_DEVICE_TOKEN_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
export declare const SEND_PUSH_RESPONSE: {
    status: HttpStatus;
    schema: {
        type: string;
        description: string;
        properties: {
            statusCode: {
                type: string;
                example: HttpStatus;
            };
            message: {
                type: string;
                example: string;
            };
        };
    };
};
