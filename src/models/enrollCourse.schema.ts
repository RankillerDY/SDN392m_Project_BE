import mongoose, { Model, Schema } from 'mongoose';
import { IEnrollCourse } from '~/types';

const enrollCoursesSchema = new Schema<IEnrollCourse, Model<IEnrollCourse>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'courses'
    },
    progress: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    enrollDate: {
      type: Date,
      default: Date.now()
    },
    trackProgress: [
      {
        trackId: {
          type: Schema.Types.ObjectId,
          ref: 'tracks'
        },
        completed: {
          type: Boolean,
          default: false
        },
        subTrackProgress: [
          {
            subTrackId: {
              type: Schema.Types.ObjectId,
              ref: 'subtracks'
            },
            completed: {
              type: Boolean,
              default: false
            }
          }
        ]
      }
    ],
    is_passed: { type: Boolean, default: false }
  },

  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const enrollCourseSchema = mongoose.model<IEnrollCourse>('enrollCourses', enrollCoursesSchema);
export default enrollCourseSchema;
