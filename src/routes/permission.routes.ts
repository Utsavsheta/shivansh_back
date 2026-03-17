import { Router } from 'express';
import permissionController from '../controllers/permission.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/schema-validator.middleware';
import { permissionCreateSchema, permissionGetAllPaginatedSchema, permissionGetAllSchema, permissionUpdateSchema } from '../validations/permission.validation';

const router = Router();

router.get('/all', authenticateToken, validateSchema(permissionGetAllSchema, 'query'), permissionController.getAllPermissions);
router.get('/', authenticateToken, validateSchema(permissionGetAllPaginatedSchema, 'query'), permissionController.getAllPermissionsPaginated);
router.get('/:id', authenticateToken, permissionController.getPermissionById);

router.post('/', authenticateToken, checkRole(['ADMIN']), validateSchema(permissionCreateSchema, 'body'), permissionController.createPermission);
router.put('/:id', authenticateToken, checkRole(['ADMIN']), validateSchema(permissionUpdateSchema, 'body'), permissionController.updatePermission);
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), permissionController.deletePermission);

export default router;

