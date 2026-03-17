import { Router } from 'express';
import jewelleryTypeController from '../controllers/jewellery-type.controller';
import { authenticateToken, checkRole } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/schema-validator.middleware';
import { jewelleryTypeImageUpload } from '../utils/file-service';
import { jewelleryTypeCreateSchema, jewelleryTypeGetAllPaginatedSchema, jewelleryTypeGetAllSchema, jewelleryTypeUpdateSchema } from '../validations/jewellery-type.validation';

const router = Router();

router.get('/all',  validateSchema(jewelleryTypeGetAllSchema, 'query'), jewelleryTypeController.getAllJewelleryTypes);
router.get('/',  validateSchema(jewelleryTypeGetAllPaginatedSchema, 'query'), jewelleryTypeController.getAllJewelleryTypesPaginated);
router.get('/:id',  jewelleryTypeController.getJewelleryTypeById);

router.post('/', authenticateToken, checkRole(['ADMIN']), jewelleryTypeImageUpload.single('image'), validateSchema(jewelleryTypeCreateSchema, 'body'), jewelleryTypeController.createJewelleryType);
router.put('/:id', authenticateToken, checkRole(['ADMIN']), jewelleryTypeImageUpload.single('image'), validateSchema(jewelleryTypeUpdateSchema, 'body'), jewelleryTypeController.updateJewelleryType);
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), jewelleryTypeController.deleteJewelleryType);

export default router;

