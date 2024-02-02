import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { ConflictRequestError, NotFoundError, NotModified } from '~/core/errorResponse.core';
import courseSchema from '~/models/course.schema';
import enrollCourseSchema from '~/models/enrollCourse.schema';
import userSchema from '~/models/user.schema';
import { IEnrollCourseCreate, IUser } from '~/types';

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
    // get user then iterate all enrollCources and get title, description, thumbnail, semester_number
    const users = await userSchema
      .findOne({
        _id: new Types.ObjectId(userId)
      })
      .populate([
        {
          path: '_id',
          select: [
            'fullName',
            'email',
            'profileName',
            'dateOfBirth',
            'profile_image',
            'is_blocked',
            'is_comment_blocked',
            'is_chat_blocked'
          ]
        },
        {
          path: 'enrollCourses',
          select: ['courseId', 'enrollDate', 'completed'],
          populate: {
            path: 'courseId',
            select: ['title', 'titleDescription', 'thumbnail']
          }
        }
      ])
      .lean();
    //check user existence
    if (!users) {
      throw new NotFoundError('Not Found User').getNotice();
    }
    return users;
  }

  static async updateUserLevel(user: IUser, id: string) {
    //Extract user information
    const { fullName, profileName, dateOfBirth, profile_image }: IUser = user;

    //Update the user in4 by _id
    try {
      const doc = await userSchema.findByIdAndUpdate(
        id,
        {
          fullName: fullName,
          profileName: profileName,
          dateOfBirth: dateOfBirth,
          profile_image: profile_image
        },
        {
          new: true
        }
      );

      //Check the in4 is updated or not
      if (!doc) {
        throw new NotModified("The user information haven't been updated").getNotice();
      }
      return doc;
    } catch (error) {
      throw new ConflictRequestError('User email already existed').getNotice();
    }
  }

  static async updateUserAdminLevel(user: IUser, id: string) {
    //Extract user information
    const { is_comment_blocked, is_chat_blocked }: IUser = user;

    //Update the user in4 by _id
    const doc = await userSchema.findByIdAndUpdate(
      id,
      {
        is_comment_blocked: is_comment_blocked,
        is_chat_blocked: is_chat_blocked
      },
      {
        new: true
      }
    );

    //Check the in4 is updated or not
    if (!doc) {
      throw new NotModified("The user information haven't been updated").getNotice();
    }
    return doc;
  }

  // Kiểm tra xem user đã đăng ký khóa học chưa
  static async checkUserRegisterCourse({ userId, courseId }: { userId: string; courseId: string }) {
    //Get user by _id
    const users = await userSchema.findById(userId).lean();

    //check user existence
    if (!users) {
      throw new NotFoundError('Not Found User').getNotice();
    }

    // Lấy course theo course_id
    const course = await courseSchema.findById(courseId).lean();
    if (!course) {
      throw new NotFoundError('Not Found Course').getNotice();
    }

    //Check user register course
    const enrollCourse = users.enrollCourses.find((course: IEnrollCourseCreate) => course._id?.toString() === courseId);
    if (!enrollCourse) {
      return false;
    }
    return true;
  }

  static async checkUserExistence(userEmail: string) {
    //Get user by _id
    const user = await userSchema.findOne({ email: userEmail }).lean();
    console.log(user);

    //check user existence
    if (!user) {
      throw new NotFoundError('Not Found User').getNotice();
    }
    return true;
  }

  static async deleteUserById(userId: string) {
    //Get user by _id
    const user = await userSchema.findById(userId).lean();
    //check user existence
    if (!user) {
      throw new NotFoundError('Not Found User').getNotice();
    }
    //Delete user
    const deletedUser = await userSchema.findOneAndUpdate(
      { _id: userId },
      { is_blocked: true },
      {
        new: true
      }
    );
    return deletedUser;
  }

  static async getEnrolledCoursesByUserId(userId: string) {
    const foundEnrolledCourses = await enrollCourseSchema.find({ userId: userId }).select('_id').lean();
    if (!foundEnrolledCourses) {
      throw new NotFoundError('Not Found User').getNotice();
    }

    //  iterate through the foundEnrolledCourses array and get the course information
    const response = await Promise.all(
      foundEnrolledCourses.map(async (enrollCourse) => {
        // map through the foundEnrolledCourses array and populate the course information, user information, track information

        const extractEnrollCourse = await enrollCourseSchema
          .findOne({
            _id: enrollCourse._id
          })
          .populate([
            {
              path: 'courseId',
              //select from courseSchema
              select: [
                'title',
                'titleDescription',
                'subTitle',
                'subTitleDescription',
                'enrollmentCount',
                'type',
                'thumbnail',
                'semester_number'
              ]
            },
            {
              path: 'userId',
              //select from userSchema
              select: ['_id', 'fullName', 'profileName', 'profile_image', 'email']
            },
            {
              path: 'trackProgress',
              populate: {
                path: 'trackId',
                //select from trackSchema
                select: ['position', 'chapterTitle', 'track_steps'],
                populate: {
                  path: 'track_steps',
                  select: ['title', 'content_url', 'position', 'duration', 'type']
                }
              }
            },
            {
              path: 'trackProgress',
              populate: {
                path: 'subTrackProgress',
                select: ['subtrackId', 'completed'],
                populate: {
                  path: 'subTrackId',
                  //select from subTrackSchema
                  select: ['title', 'content_url', 'position', 'duration', 'type']
                }
              }
            }
          ]);
        return extractEnrollCourse;
      })
    );

    return response;
  }
}

export default UserServices;
