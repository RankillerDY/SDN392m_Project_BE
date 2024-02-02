import { Request, Response } from 'express';
import { MESSAGE } from '~/constants';
import { CREATED, OK } from '~/core/successResponse.core';
import CartServices from '~/services/cart.services';

class CartController {
  async addToCart(req: Request, res: Response) {
    const { courseId } = req.params;
    return new CREATED({
      message: MESSAGE.ADD_TO_CART_SUCCESS,
      metadata: await CartServices.addToCart(courseId, req)
    }).send(res);
  }
  async deleteSingleItemFromCart(req: Request, res: Response) {
    const { courseId, cartId } = req.params;
    return new CREATED({
      message: MESSAGE.DELETE_ITEMS_FROM_CART_SUCCESS,
      metadata: await CartServices.deleteCourseFromCart(courseId, req, cartId)
    }).send(res);
  }
  async getCartByUserId(req: Request, res: Response) {
    const userId = req.user?._id;
    return new OK({
      message: MESSAGE.GET_CART_BY_USER_ID_SUCCESS,
      metadata: await CartServices.getCartByUserId(userId)
    }).send(res);
  }
}

export = new CartController();
