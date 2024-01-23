// reuseable type definition
// common type definition
// literal type definition
// ----------------------------------------------------------------------
import { Request } from 'express';
import { IUser } from './types';

// Extend the Request type from 'express'
declare module 'express' {
  interface Request {
    user?: IUser;
  }
}
