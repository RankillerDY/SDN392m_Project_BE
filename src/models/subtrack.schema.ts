import mongoose, { Model, Schema } from 'mongoose';
import { ISubTrack } from '~/types';

const subTrackSchema = new Schema<ISubTrack, Model<ISubTrack>>(
  {
    title: { type: String, required: true, unique: false },
    content_url: { type: String, default: '' },
    position: { type: Number },
    duration: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['video', 'document'],
      default: 'video'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const SubTrackSchema = mongoose.model<ISubTrack>('subtracks', subTrackSchema);
export default SubTrackSchema;
