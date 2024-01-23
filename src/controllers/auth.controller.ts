import { Request, Response } from 'express';
import { OK } from '~/core/successResponse.core';
import AuthServices from '~/services/auth.services';

class AuthController {
  async login(req: Request, res: Response) {
    return new OK({
      message: 'Login successfully',
      metadata: await AuthServices.signIn(req.body.email)
    }).send(res);
  }

  //   async logout(req: Request, res: Response) {
  //     return new OK({
  //       message: 'Logout successfully',
  //       metadata: await AuthServices.()
  //     }).send(res)
  //   }

  async register(req: Request, res: Response) {
    const { email, fullName, profileImage } = req.body;
    return new OK({
      message: 'Sign up successfully !',
      metadata: await AuthServices.signUp(email, fullName, profileImage)
    }).send(res);
  }
}

export = new AuthController();
