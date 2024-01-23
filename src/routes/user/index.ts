import { Router } from 'express';
import UserController from '~/controllers/user.controller';
import { asyncHandler } from '~/helper/asyncHandler';
import { isAuthenticated } from '~/middleware/authenticate';

const UserRouter = Router();
const userController = new UserController();

UserRouter.get('/get-all-users', isAuthenticated, asyncHandler(userController.getAllUsers));
UserRouter.get('/:id', isAuthenticated, asyncHandler(userController.getUserById));
UserRouter.put('/updateUserLevel/:id', asyncHandler(userController.updateUserLevel));
UserRouter.put('/updateUserAdminLevel/:id', asyncHandler(userController.updateUserAdminLevel));

export default UserRouter;
//kienmundo123@gmail.com