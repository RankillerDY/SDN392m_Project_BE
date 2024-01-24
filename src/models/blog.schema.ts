import mongoose, { Model, Schema } from 'mongoose';
import { IBlog } from '~/types';

const blogSchema = new Schema<IBlog, Model<IBlog>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    min_read: { type: Number, required: true },
    images: [{ type: String, required: true }],
    date_published: { type: Date, default: Date.now },
    date_modified: { type: Date, default: null },
    thumbnail_url: { type: String, default: null },
    comment_obj: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
    content: { type: String, required: true },
    tags: [{ type: String, default: null }],
    status: { type: String, default: 'pending' }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IBlog>('blogs', blogSchema);
