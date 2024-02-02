import { Router } from 'express';
import cartController from '~/controllers/cart,controller';
import { asyncHandler } from '~/helper/asyncHandler';
import { isAuthenticated } from '~/middleware/authenticate';

const cartRouter = Router();

cartRouter.post('/add-to-cart/:courseId', isAuthenticated, asyncHandler(cartController.addToCart));
cartRouter.put(
  '/:cartId/delete-single/:courseId',
  isAuthenticated,
  asyncHandler(cartController.deleteSingleItemFromCart)
);
cartRouter.get('/retrieve-user-cart', isAuthenticated, asyncHandler(cartController.getCartByUserId));
export default cartRouter;
