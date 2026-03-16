import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/schema-validator.middleware';
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    registerSchema
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validateSchema(registerSchema, 'body'), authController.register);
router.post('/login', validateSchema(loginSchema, 'body'), authController.login);
router.post('/forgot-password', validateSchema(forgotPasswordSchema, 'body'), authController.forgotPassword);
router.post('/change-password', authenticateToken, checkRole(['ADMIN', 'MANAGER', 'STAFF']), validateSchema(changePasswordSchema, 'body'), authController.changePassword);

export default router;
