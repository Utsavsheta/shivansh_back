import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import permissionRoutes from './permission.routes';
import categoryRoutes from './category.routes';
import jewelleryTypeRoutes from './jewellery-type.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/permission', permissionRoutes);
router.use('/category', categoryRoutes);
router.use('/jewellery-type', jewelleryTypeRoutes);

export default router;