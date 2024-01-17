import mongoose, { Schema, Model, Types } from 'mongoose'

interface Content {
  title: string
  src: string
  position: number
}

export interface TrackCourse {
  courseId: Types.ObjectId
  chapterTitle: string
  content: Types.DocumentArray<Content>
}

const trackSchema = new Schema<TrackCourse, Model<TrackCourse>>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'courses' },
    chapterTitle: { type: String },
    content: [
      {
        title: { type: String },
        src: { type: String },
        position: { type: Number }
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

const Track = mongoose.model('tracks', trackSchema)
export default Track
