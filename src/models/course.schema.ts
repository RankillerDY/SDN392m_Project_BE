import mongoose, { Model, Schema } from 'mongoose';
import { ICourse } from '~/types';

const courseSchema = new Schema<ICourse, Model<ICourse>>(
  {
    title: { type: String, required: true, unique: true },
    titleDescription: { type: String, required: true },
    subTitle: { type: String, default: null },
    subTitleDescription: [{ type: String, default: null }],
    tracks: [{ type: Schema.Types.ObjectId, ref: 'tracks' }],
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
);

export default mongoose.model<ICourse>('courses', courseSchema);
