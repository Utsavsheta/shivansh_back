import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/schema-validator.middleware';
import { userProfileUpload } from '../utils/file-service';
import { userAdminCreateSchema, userAdminUpdateSchema, userGetAllPaginatedSchema, userGetAllSchema, userUpdateProfileSchema } from '../validations/user.validation';

const router = Router();

router.get('/all', authenticateToken, checkRole(['ADMIN']), validateSchema(userGetAllSchema, 'query'), userController.getAllUsers);
router.get('/', authenticateToken, checkRole(['ADMIN']), validateSchema(userGetAllPaginatedSchema, 'query'), userController.getAllUsersPaginated);
router.get('/:id', authenticateToken, checkRole(['ADMIN']), userController.getUserById);
router.post('/', authenticateToken, checkRole(['ADMIN']), validateSchema(userAdminCreateSchema, 'body'), userController.createUser);
router.put('/:id', authenticateToken, checkRole(['ADMIN']), validateSchema(userAdminUpdateSchema, 'body'), userController.updateUser);

router.get('/profile/me', authenticateToken, checkRole(['ADMIN', 'MANAGER', 'STAFF']), userController.getCurrentUser);

router.put('/profile', authenticateToken, checkRole(['ADMIN', 'MANAGER', 'STAFF']), userProfileUpload.single('profile_pic'), validateSchema(userUpdateProfileSchema, 'body'), userController.updateUserProfile);

router.delete('/:id', authenticateToken, checkRole(['ADMIN']), userController.deleteUser);

export default router;