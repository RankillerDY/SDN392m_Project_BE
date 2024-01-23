import mongoose, { Model, Schema } from 'mongoose';
import { IBlog } from '~/types';

const blogSchema = new Schema<IBlog, Model<IBlog>>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    comments: [
      { userId: { type: Schema.Types.ObjectId, ref: 'users' }, description: { type: String, required: true } }
    ],
    status: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IBlog>('blogs', blogSchema);
