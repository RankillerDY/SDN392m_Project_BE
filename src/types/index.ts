import { ObjectId, Types } from 'mongoose';

export interface IBlog extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  min_read: number;
  images: HTMLCollectionOf<HTMLImageElement>;
  date_published: Date;
  date_modified: Date;
  comment_obj: Array<ObjectId>;
  thumbnail_url: string;
  content: string;
  tags: Array<string>;
  status: string;
}

export interface ICourse {
  title: string;
  titleDescription: string;
  subTitle: string;
  subTitleDescription: string;
  tracks: Types.DocumentArray<ITrackCourse>;
  enrollmentCount: number;
  is_active: boolean;
  type: string;
  amount: number;
  thumbnail: string;
  quiz: Types.DocumentArray<IQuiz>;
  lecture: Types.ObjectId;
  semester_number: number;
}

export interface INewsFeed extends Document {
  title: string;
  description: string;
  image: string;
}

export interface INotification extends Document {
  user_id: Types.ObjectId;
  course_id: Types.ObjectId;
  detail: string;
  status: string;
}

export interface IOrder extends Document {
  user_id: Types.ObjectId;
  course_id: [Types.ObjectId];
  payment: [Types.ObjectId];
  total_amount: number;
  status: string;
}

export interface IPayment extends Document {
  user_id: Types.ObjectId;
  amount: number;
  payment_method: string;
}

export interface IQuiz {
  question: string;
  type: string;
  answer: Types.Array<string>;
  rightAnswer: string;
  status: string;
}

export interface IResults extends Document {
  user_id: Types.ObjectId;
  course_id: Types.ObjectId;
  is_passed: boolean;
}

export interface IReview extends Document {
  review: string;
  star: number;
  description: string;
  answer: Types.ObjectId[];
  course: Types.ObjectId;
  user: Types.ObjectId;
}

export interface ITrackCourse {
  chapterTitle: string;
  track_steps: Types.DocumentArray<ISubTrack>;
  position: number;
}

export interface ISubTrack {
  title: string;
  content_url: string;
  position: number;
  duration: number;
  type: string;
}

export interface ITransaction extends Document {
  response_code: string;
  payer: {
    email: string;
    name: string;
    phone: string;
    address: string;
  };
  type: string;
  status: string;
}

interface ITrackProgress {
  trackId: Types.ObjectId;
  completed: boolean;
  subTrackProgress: [
    {
      subTrackId: Types.ObjectId;
      completed: boolean;
    }
  ];
}
export interface IEnrollCourse extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  progress: number;
  enrollDate: Date;
  completed: boolean;
  trackProgress: Types.DocumentArray<ITrackProgress>;
  is_passed: boolean;
}

export type IEnrollCoursePopulated = IEnrollCourse & {
  courseId: ICourse;
  userId: IUser;
};

export type IEnrollCourseCreate = IEnrollCourse & {
  _id: Types.ObjectId;
};

export interface IUser extends Document {
  email: string;
  fullName: string;
  profileName: string;
  dateOfBirth: Date;
  password: string;
  enrollCourses: Types.DocumentArray<IEnrollCourse>;
  role: string;
  is_comment_blocked: boolean;
  is_blocked: boolean;
  is_chat_blocked: boolean;
  profile_image: string;
  published_at: Date;
  cart_id: Types.ObjectId;
}

export interface IVoucher extends Document {
  code: string;
  course: Types.ObjectId;
  maxUses: number;
  discount: string;
  used_count: number;
  expiration_date: Date;
  status: string;
  type: string;
  image: string;
}

export interface ICart extends Document {
  user_id: Types.ObjectId;
  created_at: Date;
  items: [Types.ObjectId];
  amount: number;
}
