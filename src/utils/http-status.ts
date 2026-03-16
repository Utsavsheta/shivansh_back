import { Response } from 'express';
import { Response as ResponseInterface } from '../interfaces/response.interfaces';

/** Send success response */
export const sendSuccessResponse = (res: Response, message: string, data: unknown = null) => {
    const resObject: ResponseInterface = { success: true, message, data };
    res.status(200).json(resObject);
};

/** Send error response */
export const sendBadRequestResponse = (res: Response, message: string = 'Something went wrong, please try again later.', data: unknown = null) => {
    const resObject: ResponseInterface = { success: false, message, data };
    res.status(400).json(resObject);
};

/** Send unauthorized response */
export const sendUnauthorizedResponse = (res: Response, message: string = 'Invalid token.', data: unknown = null) => {
    const resObject: ResponseInterface = { success: false, message, data };
    res.status(401).json(resObject);
};

/** Send not found response */
export const sendNotFoundResponse = (res: Response, message: string, data: unknown = null) => {
    const resObject: ResponseInterface = { success: false, message, data };
    res.status(404).json(resObject);
};

/** Send forbidden response */
export const sendForbiddenResponse = (res: Response, message: string = 'Access forbidden.', data: unknown = null) => {
    const resObject: ResponseInterface = { success: false, message, data };
    res.status(403).json(resObject);
};

/** Send conflict error response */
export const sendConflictErrorResponse = (res: Response, message: string, data: unknown = null) => {
    const resObject: ResponseInterface = { success: false, message, data };
    res.status(409).json(resObject);
};

/** Send internal server error response */
export const sendServerErrorResponse = (res: Response, message: string = 'Internal server error.', data: unknown = null) => {
    const resObject: ResponseInterface = { success: false, message, data };
    res.status(500).json(resObject);
};