"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authenticateToken = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const crypto_helper_1 = __importDefault(require("../utils/crypto-helper"));
const http_status_1 = require("../utils/http-status");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return (0, http_status_1.sendUnauthorizedResponse)(res, 'Access token required');
        }
        const decoded = crypto_helper_1.default.verifyToken(token);
        if (!decoded) {
            return (0, http_status_1.sendUnauthorizedResponse)(res, 'Invalid or expired token');
        }
        const userData = await user_service_1.default.findUserById(decoded.id);
        if (!userData) {
            return (0, http_status_1.sendUnauthorizedResponse)(res, 'Invalid or expired token');
        }
        res.locals.auth = {
            user_id: userData.id,
            email: userData.email,
            role: userData.role,
            user: userData
        };
        next();
    }
    catch (error) {
        return (0, http_status_1.sendUnauthorizedResponse)(res, 'Invalid or expired token');
    }
};
exports.authenticateToken = authenticateToken;
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if auth middleware has been executed and user data is available
            if (!res.locals.auth || !res.locals.auth.role) {
                return (0, http_status_1.sendUnauthorizedResponse)(res, 'You are not authorized to access this resource.');
            }
            const userRole = res.locals.auth.role;
            // If user has no role, deny access
            if (!userRole) {
                return (0, http_status_1.sendForbiddenResponse)(res, 'You are not authorized to access this resource.');
            }
            // Check if user's role is in the allowed roles array
            const hasPermission = allowedRoles.includes(userRole);
            if (!hasPermission) {
                return (0, http_status_1.sendForbiddenResponse)(res, `You are not authorized to access this resource.`);
            }
            // Role check passed, continue to next middleware
            next();
        }
        catch (error) {
            console.log('Role middleware error: ', error);
            (0, http_status_1.sendUnauthorizedResponse)(res, 'You are not authorized to access this resource.');
            next(error);
        }
    };
};
exports.checkRole = checkRole;
