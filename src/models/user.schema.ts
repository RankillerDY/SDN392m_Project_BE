import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '~/types';

const userSchema = new Schema<IUser, Model<IUser>>(
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
    enrollCourses: [{ type: Schema.Types.ObjectId, ref: 'enrollCourses' }],
    role: {
      type: String,
      enum: ['admin', 'student', 'teacher'],
      default: 'student'
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
    },
    cart_id: {
      type: Schema.Types.ObjectId,
      ref: 'carts'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export = mongoose.model<IUser>('users', userSchema);
