import { Router } from 'express';
import courseRouter from './course';
import authRouter from './auth';
import userRouter from './user';
import trackRouter from './track';
import blogRouter from './blog';
import cartRouter from './cart';

const router = Router();

router.use('/course', courseRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/track', trackRouter);
router.use('/blog', blogRouter);
router.use('/cart', cartRouter);

export { router as Routes };
