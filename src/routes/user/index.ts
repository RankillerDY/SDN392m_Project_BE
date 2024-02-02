import { USER_ROLE } from '~/constants';
import { Router } from 'express';
import UserController from '~/controllers/user.controller';
import { asyncHandler } from '~/helper/asyncHandler';
import { authorizeRoles, isAuthenticated } from '~/middleware/authenticate';

const UserRouter = Router();
const userController = new UserController();

UserRouter.get(
  '/get-all-users',
  isAuthenticated,
  authorizeRoles([USER_ROLE.ADMIN]),
  asyncHandler(userController.getAllUsers)
);
UserRouter.get('/:id', isAuthenticated, asyncHandler(userController.getUserById));
UserRouter.get('/isExisted/:email', isAuthenticated, asyncHandler(userController.checkUserExistence));
UserRouter.post('/checkUserRegisterCourse', asyncHandler(userController.checkUserRegisterCourse));
UserRouter.put('/updateUserLevel/:id', asyncHandler(userController.updateUserLevel));
UserRouter.put('/updateUserAdminLevel/:id', asyncHandler(userController.updateUserAdminLevel));
UserRouter.delete('/delete/:id', isAuthenticated, asyncHandler(userController.deleteUserById));
UserRouter.get(
  '/:userId/get-enrolled-course',
  isAuthenticated,
  asyncHandler(userController.getEnrolledCoursesByUserId)
);

export default UserRouter;
