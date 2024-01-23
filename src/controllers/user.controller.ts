import { Request, Response } from 'express';
import { OK } from '~/core/successResponse.core';
import UserServices from '~/services/user.services';

class UserController {
  async getAllUsers(req: Request, res: Response) {
    return new OK({
      message: 'Get All Users Successfully!',
      metadata: await UserServices.getAllUsers()
    }).send(res);
  }

  async getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    return new OK({
      message: 'Get User Successfully!',
      metadata: await UserServices.getUserById(userId)
    }).send(res);
  }

  async updateUserLevel(req: Request, res: Response) {
    return new OK({
      message: 'Update User Successfully!',
      metadata: await UserServices.updateUserLevel(req.body, req.params.id)
    }).send(res);
  }

  async updateUserAdminLevel(req: Request, res: Response) {
    return new OK({
      message: 'Update User Successfully!',
      metadata: await UserServices.updateUserAdminLevel(req.body, req.params.id)
    }).send(res);
  }
}


export default UserController;
