import * as dotenv from 'dotenv';
import { ConflictRequestError, NotFoundError, NotModified } from '~/core/errorResponse.core';
import userSchema from '~/models/user.schema';
import { IUser } from '~/types';

dotenv.config();

class UserServices {
  static async getAllUsers() {
    const users = await userSchema.find({});
    if (!users || users.length === 0) {
      throw new NotFoundError('Not Found Any Users').getNotice();
    }
    return users;
  }
  
  static async getUserById(userId: string) {
    //Get user by _id
    const users = await userSchema
    .findById(userId).lean();

    //check user existence
    if (!users) {
      throw new NotFoundError('Not Found User').getNotice();
    }
    return users;
  }

  static async updateUserLevel(user: IUser, id: string) {
    //Extract user information
    const {
      email,
      fullName,
      profileName,
      dateOfBirth,
      profile_image,
    } : IUser = user;

    //Update the user in4 by _id
    try {
      const doc = await userSchema.findByIdAndUpdate(id, {
      email: email,
      fullName: fullName,
      profileName: profileName,
      dateOfBirth: dateOfBirth,
      profile_image: profile_image
    }, {
      new: true
    })
    
    //Check the in4 is updated or not
    if(!doc) {
      throw new NotModified("The user information haven't been updated").getNotice();
    }
    return doc;
    } catch (error) {
      throw new ConflictRequestError("User email already existed").getNotice();
    }
  }

  static async updateUserAdminLevel(user: IUser, id: string) {
    //Extract user information
    const {
      is_comment_blocked,
      is_blocked,
      is_chat_blocked
    } : IUser = user;
    
    //Update the user in4 by _id
    const doc = await userSchema.findByIdAndUpdate(id, {
      is_blocked: is_blocked,
      is_comment_blocked: is_comment_blocked,
      is_chat_blocked: is_chat_blocked
    }, {
      new: true
    })
    
    //Check the in4 is updated or not
    if(!doc) {
      throw new NotModified("The user information haven't been updated").getNotice();
    }
    return doc;
  }
}

export default UserServices;
