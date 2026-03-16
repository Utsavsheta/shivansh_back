"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const hashAsync = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, 10);
});
/** Asynchronous function to compare a password with a hashed password using bcrypt */
const compareAsync = (password, passwordHash) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(password, passwordHash);
});
exports.default = {
    encrypt,
    decrypt,
    verifyToken,
    hashAsync,
    compareAsync
};
