import { NextFunction, Request, Response } from 'express';
import { ERROR, MESSAGE } from '~/constants';
import { BadRequestError, ForbiddenError, InternalServerError } from '~/core/errorResponse.core';
import STATUS_CODE from '~/core/statusCode.core';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  err.statusCode = err.status || STATUS_CODE.INTERNAL_SERVER_ERROR;
  err.message = err.message || 'Internal server error';
  if (err.name) {
    switch (err.name) {
      case ERROR.CAST_ERROR: {
        const castErrorMessage = `Resource not found. Invalid ${err.path}`;
        err = new BadRequestError(castErrorMessage);
        break;
      }

      case ERROR.DUPLICATE_VALUE: {
        const duplicateKeyMessage = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new BadRequestError(duplicateKeyMessage);
        break;
      }

      case ERROR.JSON_WEB_TOKEN_ERROR: {
        const jwtErrorMessage = MESSAGE.INVALID_JSON_TOKEN;
        err = new ForbiddenError(jwtErrorMessage);
        break;
      }

      case ERROR.TOKEN_EXPIRED: {
        const tokenExpiredMessage = MESSAGE.EXPIRED_JSON_TOKEN;
        err = new BadRequestError(tokenExpiredMessage);
        break;
      }

      default:
        err = new InternalServerError('Internal server error');
        break;
    }
  }

  res.status(err.status).json({
    message: err.message,
    status: err.status,
    stack: err.stack,
    data: []
  });

  next();
};
