import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import permissionRoutes from './permission.routes';
import categoryRoutes from './category.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/permission', permissionRoutes);
router.use('/category', categoryRoutes);

export default router;