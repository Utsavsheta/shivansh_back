import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/schema-validator.middleware';
import { categoryMediaUpload } from '../utils/file-service';
import { categoryCreateSchema, categoryGetAllPaginatedSchema, categoryGetAllSchema, categoryUpdateSchema } from '../validations/category.validation';

const router = Router();

router.get('/all', authenticateToken), validateSchema(categoryGetAllSchema, 'query'), categoryController.getAllCategories;
router.get('/', authenticateToken), validateSchema(categoryGetAllPaginatedSchema, 'query'), categoryController.getAllCategoriesPaginated;
router.get('/:id', authenticateToken), categoryController.getCategoryById;

router.post('/', authenticateToken, checkRole(['ADMIN']), categoryMediaUpload.single('category_image'), validateSchema(categoryCreateSchema, 'body'), categoryController.createCategory);
router.put('/:id', authenticateToken, checkRole(['ADMIN']), categoryMediaUpload.single('category_image'), validateSchema(categoryUpdateSchema, 'body'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), categoryController.deleteCategory);

export default router;

