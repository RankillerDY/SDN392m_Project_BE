import mongoose, { Model, Schema } from 'mongoose';
import { INewsFeed } from '~/types';

export const newsFeedSchema = new Schema<INewsFeed, Model<INewsFeed>>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<INewsFeed>('newsFeeds', newsFeedSchema);
