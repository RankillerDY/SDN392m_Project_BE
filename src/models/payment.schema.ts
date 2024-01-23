import mongoose, { Model, Schema } from 'mongoose';
import { IPayment } from '~/types';

export const paymentSchema = new Schema<IPayment, Model<IPayment>>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: [true, 'userId is required!'] },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IPayment>('payments', paymentSchema);
