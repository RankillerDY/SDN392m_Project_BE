import mongoose, { Schema, Model, Types } from 'mongoose'

interface EnrollCourse {
  courseId?: Types.ObjectId
  is_passed?: boolean
}

interface User {
  email: string
  fullName: string
  profileName: string
  dateOfBirth: Date
  password: string
  enrollCourses: Types.DocumentArray<EnrollCourse>
  role: string
  is_comment_blocked: boolean
  is_blocked: boolean
  is_chat_blocked: boolean
  profile_image: string
  published_at: Date
}

const userSchema = new Schema<User, Model<User>>(
  {
    email: {
      type: String,
      required: true,
      unique: true
      // validate: {
      //   validator: (v: string) => {
      //     return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v)
      //   },
      //   message: (props: any) => `${props.value} is not a valid email`
      // }
    },
    fullName: {
      type: String,
      default: 'unknown'
    },
    profileName: {
      type: String,
      default: 'unknown'
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    enrollCourses: [
      {
        courseId: { type: Types.ObjectId, ref: 'courses' },
        is_passed: { type: Boolean, default: false }
      }
    ],
    role: {
      type: String,
      default: 'user'
    },
    is_comment_blocked: {
      type: Boolean,
      default: false
    },
    is_blocked: {
      type: Boolean,
      default: false
    },
    is_chat_blocked: {
      type: Boolean,
      default: false
    },
    profile_image: {
      type: String,
      default: null
    },
    published_at: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

export = mongoose.model('users', userSchema)
