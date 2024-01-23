import mongoose, { Model, Schema } from 'mongoose';
import { INotification } from '~/types';

const notificationSchema = new Schema<INotification, Model<INotification>>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    course_id: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    detail: { type: String, required: true },
    status: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<INotification>('notifications', notificationSchema);
