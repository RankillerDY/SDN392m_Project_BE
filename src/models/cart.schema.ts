import mongoose, { Model, Schema } from 'mongoose';
import { ICart } from '~/types';

export const cartSchema = new Schema<ICart, Model<ICart>>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    created_at: {
      type: Date,
      default: new Date()
    },
    items: [{ type: Schema.Types.ObjectId, ref: 'courses' }],
    amount: { type: Number, default: 0 }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<ICart>('carts', cartSchema);
