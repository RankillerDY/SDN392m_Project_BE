import mongoose, { Model, Schema } from 'mongoose';
import { IVoucher } from '~/types';

export const voucherSchema = new Schema<IVoucher, Model<IVoucher>>(
  {
    code: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'courses', required: true },
    maxUses: { type: Number, required: true },
    discount: { type: String, required: true },
    used_count: { type: Number, required: true },
    expiration_date: { type: Date, required: true },
    status: { type: String, required: true },
    image: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<IVoucher>('vouchers', voucherSchema);
