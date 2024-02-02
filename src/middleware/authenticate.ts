import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '~/constants';
import { AuthFailureError } from '~/core/errorResponse.core';
import { asyncHandler } from '~/helper/asyncHandler';
import blogSchema from '~/models/blog.schema';
import userSchema from '~/models/user.schema';

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const secondItemIndex = 1;
  if (req.headers.authorization) {
    token = (req.headers.authorization as string).split(' ')[secondItemIndex];
  }
  if (!token) {
    throw new AuthFailureError('You are not logged in! Please log in to get access').getNotice();
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

  const currentUser = await userSchema.findById(decoded._id);
  if (!currentUser) {
    throw new AuthFailureError('The User is no longer Exist!!!').getNotice();
  }
  req.user = currentUser;
  next();
});

export const authorizeRoles = (roles: USER_ROLE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      throw new AuthFailureError(`Role: ${req.user?.role} is not allowed to access this resource`).getNotice();
    }
    next();
  };
};

// Check user is correct author of blog
export const isAuthor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.params.id;
  try {
    const blog = await blogSchema.findById(blogId);
    if (!blog) {
      throw new AuthFailureError('You are not the author of this blog').getNotice();
    }
    const blogUserInfo = await userSchema.findById(blog?.userId);
    // If user has the role 'admin'==> next()
    if (req?.user?.role === 'admin') {
      next();
    } else {
      // Check if user is the correct author of the blog
      if (blogUserInfo?.email !== req?.user?.email) {
        throw new AuthFailureError('You are not the author of this blog').getNotice();
      }
      next();
    }
  } catch (error) {
    next(error);
  }
});
