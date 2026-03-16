"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendServerErrorResponse = exports.sendConflictErrorResponse = exports.sendForbiddenResponse = exports.sendNotFoundResponse = exports.sendUnauthorizedResponse = exports.sendBadRequestResponse = exports.sendSuccessResponse = void 0;
/** Send success response */
const sendSuccessResponse = (res, message, data = null) => {
    const resObject = { success: true, message, data };
    res.status(200).json(resObject);
};
exports.sendSuccessResponse = sendSuccessResponse;
/** Send error response */
const sendBadRequestResponse = (res, message = 'Something went wrong, please try again later.', data = null) => {
    const resObject = { success: false, message, data };
    res.status(400).json(resObject);
};
exports.sendBadRequestResponse = sendBadRequestResponse;
/** Send unauthorized response */
const sendUnauthorizedResponse = (res, message = 'Invalid token.', data = null) => {
    const resObject = { success: false, message, data };
    res.status(401).json(resObject);
};
exports.sendUnauthorizedResponse = sendUnauthorizedResponse;
/** Send not found response */
const sendNotFoundResponse = (res, message, data = null) => {
    const resObject = { success: false, message, data };
    res.status(404).json(resObject);
};
exports.sendNotFoundResponse = sendNotFoundResponse;
/** Send forbidden response */
const sendForbiddenResponse = (res, message = 'Access forbidden.', data = null) => {
    const resObject = { success: false, message, data };
    res.status(403).json(resObject);
};
exports.sendForbiddenResponse = sendForbiddenResponse;
/** Send conflict error response */
const sendConflictErrorResponse = (res, message, data = null) => {
    const resObject = { success: false, message, data };
    res.status(409).json(resObject);
};
exports.sendConflictErrorResponse = sendConflictErrorResponse;
/** Send internal server error response */
const sendServerErrorResponse = (res, message = 'Internal server error.', data = null) => {
    const resObject = { success: false, message, data };
    res.status(500).json(resObject);
};
exports.sendServerErrorResponse = sendServerErrorResponse;
