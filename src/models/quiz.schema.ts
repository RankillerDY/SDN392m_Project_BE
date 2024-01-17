import mongoose, { Schema, Model, Types } from 'mongoose'

export interface Quiz {
  question: string
  type: string
  answer: Types.Array<string>
  rightAnswer: string
  status: string
}

const quizSchema = new Schema<Quiz, Model<Quiz>>(
  {
    question: { type: String, required: true },
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
)

const QuizModel = mongoose.model<Quiz>('quizzes', quizSchema)
export default QuizModel
