"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorHandler_1 = __importDefault(require("../errorHandler/errorHandler"));
/**Create middleware for error log */
const errorMiddleware = (error, request, response, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    // Format current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    // Log error stack if available, otherwise log error message
    if (error.stack) {
        console.error(`[${formattedDate}] ${error.stack}`);
    }
    else {
        console.error(`[${formattedDate}] ${error.message}`);
    }
    const url = `Location of Error : ${request.originalUrl}  Method : ${request.method}  Request Body : ${JSON.stringify(request.body)}`;
    (0, errorHandler_1.default)(error, url);
    if (response.headersSent) {
        return next(error);
    }
    response.status(status).send({ status, message });
};
exports.errorMiddleware = errorMiddleware;
