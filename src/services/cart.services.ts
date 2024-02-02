import * as dotenv from 'dotenv';
import { Request } from 'express';
import { Types } from 'mongoose';
import { NotFoundError, NotModified } from '~/core/errorResponse.core';
import cartSchema from '~/models/cart.schema';
import courseSchema from '~/models/course.schema';
import { ICart, ICourse } from '~/types';

type ICartDocument = ICart & {
  _id: Types.ObjectId;
};
type ICourseDocument = ICourse & {
  _id: Types.ObjectId;
};

dotenv.config();

class CartServices {
  static async addToCart(courseId: string, req: Request) {
    const { _id } = req.user;
    // check courseId is exist in cart
    const foundCourse: ICourseDocument | null = await courseSchema.findById(courseId);
    console.log(foundCourse);
    if (!foundCourse) {
      throw new NotFoundError('Course not found with given id').getNotice();
    }

    // check course is exist in cart or not
    const foundCart: ICartDocument | null = await cartSchema.findOne({
      items: {
        $elemMatch: {
          $eq: foundCourse._id
        }
      }
    });

    if (foundCart) {
      throw new NotFoundError('Course is already exist in cart').getNotice();
    }

    // create new cart and add new course to cart
    const newCart = await cartSchema.findOneAndUpdate(
      {
        user_id: new Types.ObjectId(_id)
      },
      {
        $push: {
          items: foundCourse._id
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    if (!newCart) {
      throw new NotModified('Cannot create new cart').getNotice();
    }

    return await newCart.populate([
      {
        path: 'items',
        select: ['title', 'description', 'amount', 'thumbnail']
      },
      {
        path: 'user_id',
        select: ['_id', 'email', 'first_name', 'last_name']
      }
    ]);
  }

  static async deleteCourseFromCart(courseId: string, req: Request, cartId: string) {
    const { _id } = req.user;
    // check courseId is exist in cart
    const foundCourse: ICourseDocument | null = await courseSchema.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundError('Course not found with given id').getNotice();
    }

    // check course is exist in cart or not
    const foundCart: ICartDocument | null = await cartSchema.findOne(
      {
        _id: new Types.ObjectId(cartId)
      },
      {
        items: {
          $elemMatch: {
            $eq: foundCourse._id
          }
        }
      }
    );

    if (!foundCart) {
      throw new NotFoundError('Cart stored does match with any given id').getNotice();
    }

    // delete course from cart
    const newCart = await cartSchema.findOneAndUpdate(
      {
        user_id: new Types.ObjectId(_id)
      },
      {
        $pull: {
          items: foundCourse._id
        }
      },
      {
        new: true
      }
    );

    if (!newCart) {
      throw new NotModified('Cannot delete course from cart').getNotice();
    }

    return newCart;
  }

  static async getCartByUserId(userId: string) {
    const foundCart = await cartSchema.findOne({
      user_id: new Types.ObjectId(userId)
    });

    if (!foundCart) {
      throw new NotFoundError('Cart not found with given id').getNotice();
    }

    return await foundCart.populate([
      {
        path: 'user_id',
        select: ['_id', 'email', 'first_name', 'last_name']
      },
      {
        path: 'items',
        select: ['title', 'description', 'amount', 'thumbnail']
      }
    ]);
  }
}

export default CartServices;
