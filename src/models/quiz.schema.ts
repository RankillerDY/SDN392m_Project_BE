import mongoose, { Model, Schema } from 'mongoose';
import { IQuiz } from '~/types';

const quizSchema = new Schema<IQuiz, Model<IQuiz>>(
  {
    question: { type: String, required: true, unique: true },
    type: { type: String, default: null },
    answer: [String],
    rightAnswer: { type: String },
    status: { type: String, required: true, default: 'active' }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const QuizModel = mongoose.model<IQuiz>('quizzes', quizSchema);
export default QuizModel;
