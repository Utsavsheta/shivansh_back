import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import userService from '../services/user.service';
import cryptoHelper from '../utils/crypto-helper';
import { sendForbiddenResponse, sendUnauthorizedResponse } from '../utils/http-status';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return sendUnauthorizedResponse(res, 'Access token required');
        }

        const decoded: JwtPayload | null = cryptoHelper.verifyToken(token);
        if(!decoded) {
            return sendUnauthorizedResponse(res, 'Invalid or expired token');
        }

        const userData = await userService.findUserById(decoded.id);
        if (!userData) {
            return sendUnauthorizedResponse(res, 'Invalid or expired token');
        }

        res.locals.auth = {
            user_id: userData.id,
            email: userData.email,
            role: userData.role,
            user: userData
        };
        next();
    } catch (error) {
        return sendUnauthorizedResponse(res, 'Invalid or expired token');
    }
};

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if auth middleware has been executed and user data is available
            if (!res.locals.auth || !res.locals.auth.role) {
                return sendUnauthorizedResponse(res, 'You are not authorized to access this resource.');
            }

            const userRole = res.locals.auth.role;
            
            // If user has no role, deny access
            if (!userRole) {
                return sendForbiddenResponse(res, 'You are not authorized to access this resource.');
            }

            // Check if user's role is in the allowed roles array
            const hasPermission = allowedRoles.includes(userRole);
            
            if (!hasPermission) {
                return sendForbiddenResponse(res, `You are not authorized to access this resource.`);
            }

            // Role check passed, continue to next middleware
            next();
        } catch (error) {
            console.log('Role middleware error: ', error);
            sendUnauthorizedResponse(res, 'You are not authorized to access this resource.');
            next(error);
        }
    };
};
