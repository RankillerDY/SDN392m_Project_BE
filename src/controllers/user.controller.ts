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
      message: 'Get user information successfully!',
      metadata: await UserServices.getUserById(userId)
    }).send(res);
  }

  async checkUserExistence(req: Request, res: Response) {
    const userEmail = req.params.email;
    return new OK({
      message: 'User is exist!',
      metadata: await UserServices.checkUserExistence(userEmail)
    }).send(res);
  }

  async deleteUserById(req: Request, res: Response) {
    const userId = req.params.id;
    return new OK({
      message: 'Delete User Successfully!',
      metadata: await UserServices.deleteUserById(userId)
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

  // Kiểm tra xem user đã đăng ký khóa học chưa
  async checkUserRegisterCourse(req: Request, res: Response) {
    return new OK({
      message: 'Have users registered for the course ?',
      metadata: await UserServices.checkUserRegisterCourse(req.body)
    }).send(res);
  }

  async getEnrolledCoursesByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    return new OK({
      message: 'Get Enrolled courses by user successfully!',
      metadata: await UserServices.getEnrolledCoursesByUserId(userId)
    }).send(res);
  }
}

export default UserController;
