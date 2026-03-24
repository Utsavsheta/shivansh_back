"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate_env_1 = __importDefault(require("./validate-env"));
const SECRET = validate_env_1.default.SECRET_KEY;
/** Function to encrypt data using JWT (JSON Web Token) */
const encrypt = (data) => {
    return jsonwebtoken_1.default.sign(data, SECRET);
};
/** Function to decode a JWT token without verifying it */
const decrypt = (token) => {
    return jsonwebtoken_1.default.decode(token);
};
/** Function to verify the validity of a JWT token */
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET);
};
/** Asynchronous function to hash a password using bcrypt */
const hashAsync = async (password) => {
    return await bcryptjs_1.default.hash(password, 10);
};
/** Asynchronous function to compare a password with a hashed password using bcrypt */
const compareAsync = async (password, passwordHash) => {
    return await bcryptjs_1.default.compare(password, passwordHash);
};
exports.default = {
    encrypt,
    decrypt,
    verifyToken,
    hashAsync,
    compareAsync
};
