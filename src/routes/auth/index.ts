import { Router } from 'express';
import authController from '~/controllers/auth.controller';
import { asyncHandler } from '~/helper/asyncHandler';

const router = Router();

router.post('/signIn', asyncHandler(authController.login));
router.post('/signUp', asyncHandler(authController.register));

export default router;
