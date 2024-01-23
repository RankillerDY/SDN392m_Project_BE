import mongoose, { Model, Schema } from 'mongoose';
import { ITransaction } from '~/types';

export const transactionSchema = new Schema<ITransaction, Model<ITransaction>>(
  {
    response_code: { type: String, required: true },
    payer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true }
    },
    type: { type: String, required: true },
    status: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

export default mongoose.model<ITransaction>('transactions', transactionSchema);
