import { userSchema } from '~/models/user.schema';
// reuseable type definition
// common type definition
// literal type definition
// ----------------------------------------------------------------------
import 'express';

// Extend the Request type from 'express'
declare module 'express' {
  interface Request {
    user?: userSchema;
  }
}
