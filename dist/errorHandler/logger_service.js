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
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const myFormat = () => {
    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISTOffset = 330; // IST offset UTC +5:30
    return new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
};
const createLogger = (route) => {
    const loggerOptions = {
        transports: [
            new winston_1.default.transports.File({
                filename: `./errorHandler/${route}.log`
            })
        ],
        format: winston_1.default.format.printf((info) => {
            var _a;
            let message = `${myFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `;
            message = ((_a = info.obj) === null || _a === void 0 ? void 0 : _a.stack) ? `${message}Error Stack: ${JSON.stringify(info.obj.stack)} | ` : message;
            return message;
        })
    };
    const instance = winston_1.default.createLogger(loggerOptions);
    return {
        error(obj, message) {
            return __awaiter(this, void 0, void 0, function* () {
                instance.log('error', message, {
                    obj
                });
            });
        }
    };
};
exports.logger = createLogger('errors');
