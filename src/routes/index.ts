import express from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/', authRoutes)

export default router;
