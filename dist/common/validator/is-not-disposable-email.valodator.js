"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotDisposableEmail = IsNotDisposableEmail;
const class_validator_1 = require("class-validator");
const disposableDomains = require('disposable-email-domains');
function IsNotDisposableEmail(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value, _args) {
                    const domain = value.split('@')[1];
                    return process.env.ENVIRONMENT === 'production'
                        ? disposableDomains.includes(domain)
                            ? false
                            : true
                        : true;
                },
                defaultMessage(args) {
                    return `Unable to use temporary ${args.property}: ${args.value}`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-not-disposable-email.valodator.js.map