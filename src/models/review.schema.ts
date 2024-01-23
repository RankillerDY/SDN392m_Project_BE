import mongoose, { Model, Schema } from 'mongoose';
import { IReview } from '~/types';

const reviewSchema = new Schema<IReview, Model<IReview>>(
  {
    review: { type: String, required: true },
    star: { type: Number, required: true },
    description: { type: String },
    answer: [{ type: Schema.Types.ObjectId, ref: 'answer' }],
    course: { type: Schema.Types.ObjectId, ref: 'courses' },
    user: { type: Schema.Types.ObjectId, ref: 'users' }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IReview>('reviews', reviewSchema);
