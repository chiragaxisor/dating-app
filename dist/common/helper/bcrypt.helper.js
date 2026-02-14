"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.encodePassword = void 0;
const bcrypt = require("bcrypt");
const encodePassword = (password) => {
    const SALT = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, SALT);
};
exports.encodePassword = encodePassword;
const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=bcrypt.helper.js.map