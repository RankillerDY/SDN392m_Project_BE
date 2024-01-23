import mongoose, { Model, Schema } from 'mongoose';
import { IResults } from '~/types';

export const resultsSchema = new Schema<IResults, Model<IResults>>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    is_passed: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IResults>('results', resultsSchema);
