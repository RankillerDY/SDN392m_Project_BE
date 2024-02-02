import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { AuthFailureError } from '~/core/errorResponse.core';
import userSchema from '~/models/user.schema';
import { getSelectData } from '~/utils/demo';

dotenv.config();
class AuthServices {
  static async signIn(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@fpt\.edu\.vn$/;
    if (!email.match(emailRegex)) {
      throw new AuthFailureError('Invalid email format or domain. Only @fpt.edu.vn emails are allowed').getNotice();
    }

    const foundUser = await userSchema.findOne({ email }).populate({
      path: 'enrollCourses',
      select: getSelectData(['progress', 'completed', 'enrollDate', 'trackProgress', 'is_passed', 'courseId'])
    });

    if (!foundUser) {
      throw new AuthFailureError('User not found with this email').getNotice();
    }

    // const coursesPromises = foundUser.enrollCourses.map(async (enrollCourse) => {
    //   const course = await courseSchema
    //     .findById(enrollCourse.courseId)
    //     .select(
    //       getSelectData([
    //         'title',
    //         'titleDescription',
    //         'subTitle',
    //         'subTitleDescription',
    //         'status',
    //         'type',
    //         'thumbnail',
    //         'is_active'
    //       ])
    //     );

    //   const trackProgressPromises = enrollCourse.trackProgress.map(async (track) => {
    //     const trackInfo = await Track.findById(track.trackId);
    //     return { ...track.toObject(), trackInfo };
    //   });

    //   const trackProgress = await Promise.all(trackProgressPromises);

    //   return { ...enrollCourse.toObject(), course, trackProgress };
    // });

    // const enrollCourses = await Promise.all(coursesPromises);

    const token = jwt.sign(
      {
        _id: foundUser._id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        dateOfBirth: foundUser.dateOfBirth,
        profileImage: foundUser.profile_image,
        // enrolledCourses: foundUser.enrollCourses,
        role: foundUser.role,
        is_comment_blocked: foundUser.is_comment_blocked,
        is_blocked: foundUser.is_blocked,
        is_chat_blocked: foundUser.is_chat_blocked
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return {
      access_token: token && `Bearer ${token}`
    };
  }

  static async signUp(email: string, fullName: string, profileImage: string) {
    // Check if the email matches the desired regex pattern
    const emailRegex = /^[a-zA-Z0-9._-]+@fpt\.edu\.vn$/;
    if (!email.match(emailRegex)) {
      throw new AuthFailureError('Invalid email format or domain. Only @fpt.edu.vn emails are allowed').getNotice();
    }
    const foundUser = await userSchema.findOne({ email }).select('-password');

    if (!foundUser) {
      const newUser = await userSchema.create({
        email: email,
        fullName: fullName,
        profile_image: profileImage,
        enrollCourses: [],
        profileName: '',
        published_at: new Date()
      });

      const token = jwt.sign(
        {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profileImage: newUser.profile_image,
          dateOfBirth: newUser.dateOfBirth,
          enrolledCourses: newUser.enrollCourses,
          role: newUser.role,
          is_comment_blocked: newUser.is_comment_blocked,
          is_blocked: newUser.is_blocked,
          createAt: newUser.published_at
        },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRE, algorithm: 'HS512' }
      );
      return {
        access_token: token && `Bearer ${token}`
      };
    } else {
      return await this.signIn(email);
    }
  }
}

export default AuthServices;
