import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthFailureError } from '~/core/errorResponse.core';
import { asyncHandler } from '~/helper/asyncHandler';
import userSchema from '~/models/user.schema';

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.accesstoken) {
    token = (req.headers.accesstoken as string).split(' ')[1];
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

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      throw new AuthFailureError(`Role: ${req.user?.role} is not allowed to access this resource`);
    }
    next();
  };
};
