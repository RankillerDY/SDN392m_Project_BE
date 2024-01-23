import mongoose, { Model, Schema, Types } from 'mongoose';
import { ITrackCourse } from '~/types';

const trackSchema = new Schema<ITrackCourse, Model<ITrackCourse>>(
  {
    position: { type: Number, required: true },
    chapterTitle: { type: String, unique: true, required: true },
    track_steps: [{ type: Schema.Types.ObjectId, ref: 'subtracks' }]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const Track = mongoose.model<ITrackCourse>('tracks', trackSchema);
export default Track;
