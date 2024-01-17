import jwt from 'jsonwebtoken'
import { AuthFailureError } from '~/core/errorResponse.core'
import userSchema from '~/models/user.schema'
import * as dotenv from 'dotenv'

dotenv.config()
class AuthServices {
  static async signIn(email: string) {
    const foundUser = await userSchema.findOne({ email })
    if (!foundUser) {
      throw new AuthFailureError('User not found with this email')
    }
    const token = jwt.sign(
      {
        _id: foundUser._id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        dateOfBirth: foundUser.dateOfBirth,
        enrolledCourses: foundUser.enrollCourses,
        is_comment_blocked: foundUser.is_comment_blocked,
        is_blocked: foundUser.is_blocked,
        is_chat_blocked: foundUser.is_chat_blocked
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '5d' }
    )
    return {
      userId: foundUser._id,
      access_token: token && `Bearer ${token}`
    }
  }

  static async signUp(email: string, fullName: string, profileImage: string) {
    const foundUser = await userSchema.findOne({ email })
    if (!foundUser) {
      const newUser = await userSchema.create({
        email: email,
        fullName: fullName,
        profile_image: profileImage,
        enrollCourses: [],
        profileName: '',
        published_at: new Date()
      })
      if (newUser) {
        const token = jwt.sign(
          {
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            profileImage: newUser.profile_image,
            dateOfBirth: newUser.dateOfBirth,
            enrolledCourses: newUser.enrollCourses,
            is_comment_blocked: newUser.is_comment_blocked,
            is_blocked: newUser.is_blocked,
            createAt: newUser.published_at
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '5d' }
        )
        return {
          userId: newUser._id,
          access_token: token && `Bearer ${token}`
        }
      }
    } else {
      return this.signIn(email)
    }
  }
}

export default AuthServices