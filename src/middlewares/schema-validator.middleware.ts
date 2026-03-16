import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { NextFunction, Request, Response } from 'express';
import { sendBadRequestResponse } from '../utils/http-status';
const ajv = new Ajv();
addFormats(ajv);
 
/** Validate schemas and missing params */
export const validateSchema = (schema: any, type: 'body' | 'query') => {
    const validate = ajv.compile(schema);
 
    return (req: Request, res: Response, next: NextFunction) => {
        const valid = validate(req[type]);
        if(!valid) return sendBadRequestResponse(res, 'Incorrect or missing parameters.', validate.errors);
 
        next();
    };
};