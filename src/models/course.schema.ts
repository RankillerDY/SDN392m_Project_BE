import mongoose, { Schema, Model, Types } from 'mongoose'
import { Quiz } from './quiz.schema'
import { TrackCourse } from './track.schema'

export interface Course {
  title: string
  titleDescription: string
  subTitle: string
  subTitleDescription: string
  tracks: Types.DocumentArray<TrackCourse>
  enrollmentCount: number
  is_active: boolean
  type: string
  amount: number
  thumbnail: string
  quiz: Types.DocumentArray<Quiz>
  lecture: Types.ObjectId
  semester_number: number
}

const courseSchema = new Schema<Course, Model<Course>>(
  {
    title: { type: String, required: true },
    titleDescription: { type: String, required: true },
    subTitle: { type: String, default: null },
    subTitleDescription: { type: String, default: null },
    tracks: [{ type: Schema.Types.ObjectId, ref: 'tracks'}],
    enrollmentCount: { type: Number, default: 0 },
    is_active: { type: Boolean, default: false },
    type: { type: String, required: true, default: 'free' },
    quiz: [{ type: Schema.Types.ObjectId, ref: 'quizzes' }],
    amount: { type: Number, default: 0 },
    thumbnail: { type: String, default: null },
    lecture: { type: Schema.Types.ObjectId, ref: 'users' },
    semester_number: { type: Number, require: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

export default mongoose.model<Course>('courses', courseSchema)
