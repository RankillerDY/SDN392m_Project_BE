import mongoose, { Model, Schema } from 'mongoose';
import { IOrder } from '~/types';

export const orderSchema = new Schema<IOrder, Model<IOrder>>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'userId is required !'] },
    course_id: [{ type: Schema.Types.ObjectId, ref: 'courses', required: true }],
    payment: [{ type: Schema.Types.ObjectId, ref: 'payments', required: true }],
    total_amount: { type: Number, required: true },
    status: { type: String, enum: ['completed', 'pending', 'canceled'], default: 'pending' }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IOrder>('orders', orderSchema);
