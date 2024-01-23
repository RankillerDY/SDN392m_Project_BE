import { ClientSession, HydratedDocument, HydratedSingleSubdocument, ObjectId, Schema, Types } from 'mongoose';
import { BadRequestError, NotFoundError, NotModified } from '~/core/errorResponse.core';
import statusCodeCore from '~/core/statusCode.core';
import courseSchema from '~/models/course.schema';
import enrollCourseSchema from '~/models/enrollCourse.schema';
import quizSchema from '~/models/quiz.schema';
import trackSchema from '~/models/track.schema';
import userSchema from '~/models/user.schema';
import { ICourse, IEnrollCourse, ISubTrack, ITrackCourse } from '~/types';
import { convertStringToObjectId, getSelectData } from '~/utils/demo';

type CourseCreated = ICourse & {
  _id: Types.ObjectId;
};

type ITrackCourseCreated = Types.Subdocument<Types.ObjectId> & ITrackCourse;
type ISubTrackCourseCreated = Types.Subdocument<Types.ObjectId> & ISubTrack;

class CourseService {
  static async getAllFreeCourses() {
    const allCourses: HydratedDocument<ICourse> = await courseSchema
      .find({
        type: 'free'
      })
      .populate({
        path: 'tracks',
        select: getSelectData(['chapterTitle', 'track_steps', 'courseId', 'position', 'created_at']),
        populate: {
          //  get all field of subtrack
          path: 'track_steps',
          select: getSelectData(['title', 'content_url', 'position', 'duration', 'type', 'created_at'])
        }
      })
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    if (!allCourses) {
      throw new NotFoundError('Not found any free course available!').getNotice();
    }
    return allCourses;
  }

  static async getAllCoursesDecrease() {
    const allCourses: HydratedDocument<ICourse>[] = await courseSchema.find({}).sort({ enrollmentCount: -1 }).lean();
    if (!allCourses) {
      throw new NotFoundError('Not found any free course available!').getNotice();
    }
    return allCourses;
  }

  static async getAllProCourses() {
    const allCourses: HydratedDocument<ICourse> = await courseSchema
      .find({
        type: 'pro'
      })
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    if (!allCourses) {
      throw new NotFoundError('Not found any pro course available!').getNotice();
    }
    return allCourses;
  }

  static async getAllTracksByCourseId(course_id: string) {
    const foundCourse = await courseSchema
      .findById(course_id)
      .populate({
        path: 'tracks',
        select: getSelectData(['chapterTitle', 'track_steps', 'courseId', 'position', 'created_at']),
        populate: {
          path: 'track_steps',
          select: getSelectData(['title', 'content_url', 'position', 'duration', 'type', 'created_at'])
        }
      })
      .lean();
    if (!foundCourse) {
      throw new NotFoundError('Not found course to get tracks').getNotice();
    }
    return foundCourse;
  }

  static async createCourse(course: Omit<ICourse, 'tracks' | 'quizzes'>) {
    const {
      title,
      titleDescription,
      subTitle,
      subTitleDescription,
      enrollmentCount,
      is_active,
      type,
      amount,
      thumbnail,
      lecture,
      semester_number
    }: Omit<ICourse, 'tracks' | 'quizzes'> = course;

    const foundUser = await userSchema.findById(lecture).lean();
    console.log('foundUser===>', foundUser);

    if (!foundUser) {
      throw new NotFoundError('Lecture id not found!').getNotice();
    }

    const newCourse = await courseSchema.create({
      title,
      titleDescription,
      subTitle,
      subTitleDescription,
      enrollmentCount: enrollmentCount,
      is_active,
      type,
      amount,
      thumbnail,
      lecture: foundUser._id,
      semester_number
    });

    if (!newCourse) {
      throw new NotFoundError('Create course failed!').getNotice();
    }
    return newCourse;
  }

  static async createCourseWithTransaction(course: any) {
    let session: ClientSession;
    let newCourseId: Types.ObjectId;
    const {
      title,
      titleDescription,
      subTitle,
      subTitleDescription,
      tracks,
      enrollmentCount,
      is_active,
      type,
      amount,
      thumbnail,
      quiz,
      lecture,
      semester_number
    }: ICourse = course;

    const foundUser = await userSchema.findById(lecture).lean();
    console.log('foundUser===>', foundUser);

    if (!foundUser) {
      throw new NotFoundError('Lecture id not found!').getNotice();
    }

    return courseSchema
      .startSession()
      .then((_session) => {
        session = _session;
        session.startTransaction();
        return quizSchema.insertMany(quiz);
      })
      .then((quizAdded) => {
        console.log('quizAdded===>', quizAdded);
        if (!quizAdded) {
          session.abortTransaction();
          session.endSession();
          throw new NotModified('Create quiz failed!').getNotice();
        }
        return courseSchema.create({
          title,
          titleDescription,
          subTitle,
          subTitleDescription,
          enrollmentCount: enrollmentCount || 0,
          is_active: is_active || false,
          type: type || 'free',
          amount: amount || 0,
          thumbnail: thumbnail || '',
          quiz: quizAdded,
          lecture: foundUser._id,
          semester_number: semester_number
        });
      })
      .then((newCourse: CourseCreated) => {
        console.log('newCourse===>', newCourse);

        if (!newCourse) {
          session.abortTransaction();
          session.endSession();
          throw new NotFoundError('Create course failed!').getNotice();
        }

        newCourseId = newCourse._id;

        const extractedTracks: ITrackCourse[] = tracks.map((track: ITrackCourse) => {
          return {
            courseId: newCourse._id,
            chapterTitle: track.chapterTitle,
            track_steps: track.track_steps,
            position: track.position
          };
        });

        return trackSchema.insertMany(extractedTracks, { session });
      })
      .then((trackResult) => {
        console.log('trackResult===>', trackResult);

        if (!trackResult) {
          session.abortTransaction();
          session.endSession();
          throw new NotModified('Create track failed!').getNotice();
        }

        const tracksIds = trackResult.map((track: any) => track._id);
        console.log('tracksIds===>', tracksIds);

        return courseSchema.findByIdAndUpdate(
          newCourseId,
          {
            $addToSet: {
              tracks: tracksIds
            }
          },
          {
            upsert: true,
            new: false,
            multi: true
          }
        );
      })
      .then(async (result) => {
        console.log('result===>', result);

        if (!result) {
          session.abortTransaction();
          session.endSession();
          throw new NotModified('Create course failed!').getNotice();
        }

        await session.commitTransaction();
        session.endSession();
        return result;
      })
      .catch((err) => {
        session.abortTransaction();
        session.endSession();
        throw err;
      });
  }

  static async getCourseBySemesterNumber(semester_number: number) {
    if (!semester_number) {
      throw new BadRequestError('Semester number is required!').getNotice();
    }
    const courses = await courseSchema
      .find({
        semester_number: semester_number
      })
      .populate({
        path: 'tracks',
        select: getSelectData(['chapterTitle', 'track_steps', 'courseId', 'position', 'created_at']),
        populate: {
          path: 'track_steps',
          select: getSelectData(['title', 'content_url', 'position', 'duration', 'type', 'created_at'])
        }
      })
      .populate({
        path: 'quiz',
        select: getSelectData(['title', 'description', 'questions', 'created_at'])
      })
      .lean();
    if (!courses || courses.length === 0) {
      throw new NotFoundError('Not found any course available!', statusCodeCore.OK).getNotice();
    }
    return courses;
  }

  static async getCourseById(courseId: string): Promise<ICourse | null> {
    try {
      const objectId = convertStringToObjectId(courseId);
      const course = await courseSchema
        .findById(objectId)
        .populate({
          path: 'tracks',
          select: getSelectData(['chapterTitle', 'track_steps', 'courseId', 'position', 'created_at']),
          populate: {
            path: 'track_steps',
            select: getSelectData(['title', 'content_url', 'position', 'duration', 'type', 'created_at'])
          }
        })
        .lean(true);
      // Ensure that course is properly typed
      return course ? course : null;
    } catch (error) {
      throw new NotFoundError('Not found any course available!').getNotice();
    }
  }

  static async enrollCourse(courseId: string, userId: string) {
    // find user by id to check user exist
    const foundUser = await userSchema.findById(userId).lean();

    if (!foundUser) {
      throw new NotFoundError('User id not found!').getNotice();
    }

    // find course by id to check course exist and get tracks
    const foundCourse = await courseSchema.findById(courseId).populate({
      path: 'tracks',
      select: getSelectData(['chapterTitle', 'track_steps', 'courseId', 'position', 'created_at'])
    });

    if (!foundCourse) {
      throw new NotFoundError('Course id not found!').getNotice();
    }

    // check user already enroll course or not ?
    const foundEnrollCourse = await enrollCourseSchema.findOne({
      userId: foundUser._id,
      courseId: foundCourse._id
    });

    if (foundEnrollCourse) {
      throw new BadRequestError('User already enroll this course!').getNotice();
    }

    // get tracks from foundCourse
    const tracks = foundCourse.tracks;

    // generate trackProgress of specific course for inspecting user progress
    const trackProgress = tracks.map((track: ITrackCourseCreated) => {
      const subTrackProgress = track.track_steps.map((subTrack: ISubTrackCourseCreated, index: number) => {
        return {
          subTrackId: subTrack._id,
          completed: false
        };
      });
      return {
        trackId: track._id,
        completed: false,
        // subTrackProgress : include array object with subtrackId and completed status
        subTrackProgess: subTrackProgress
      };
    });

    return enrollCourseSchema.startSession().then(async (session) => {
      session.startTransaction();
      // insert enroll_course
      const newEnrollCourse = await enrollCourseSchema.create({
        userId: foundUser._id,
        courseId: foundCourse._id,
        trackProgress
      });

      if (!newEnrollCourse) {
        session.abortTransaction();
        session.endSession();
        throw new NotFoundError('Insert enroll_course failed').getNotice();
      }

      // update enrollCourses in user collection
      const updatedUser = await userSchema.findByIdAndUpdate(
        foundUser._id,
        {
          $addToSet: {
            enrollCourses: newEnrollCourse._id
          }
        },
        { session }
      );

      if (!updatedUser) {
        session.abortTransaction();
        session.endSession();
        throw new NotFoundError('Update enrollCourses into user failed').getNotice();
      }

      // update enrollmentCount in course collection
      const updatedCourse = await courseSchema.findByIdAndUpdate(
        foundCourse._id,
        {
          $inc: {
            enrollmentCount: 1
          }
        },
        { session }
      );

      if (!updatedCourse) {
        session.abortTransaction();
        session.endSession();
        throw new NotFoundError('Update enrollCourse count failed').getNotice();
      }

      await session.commitTransaction();
      session.endSession();

      const response = await enrollCourseSchema
        .findOne({
          _id: newEnrollCourse._id
        })
        .select(
          getSelectData(['userId', 'courseId', 'progress', 'enrollDate', 'completed', 'trackProgress', 'created_at'])
        )
        .populate([
          {
            path: 'userId',
            select: getSelectData(['name', 'email', 'avatar'])
          },
          {
            path: 'trackProgress.trackId',
            select: getSelectData(['chapterTitle', 'courseId', 'position'])
          },
          {
            path: 'trackProgress.subTrackProgess.subTrackId',
            select: getSelectData(['title', 'content_url', 'position', 'duration', 'type'])
          }
        ]);

      return response;
    });
  }

  static async addTracksIdToCourse(courseId: string, trackId: Types.ObjectId) {
    // find course by id
    const foundCourse = await courseSchema.findById(courseId).lean();
    if (!foundCourse) {
      throw new NotFoundError('Not found course to update').getNotice();
    }
    // add tracks to course
    const result = await courseSchema.findByIdAndUpdate(
      courseId,
      {
        $addToSet: {
          tracks: trackId
        }
      },
      {
        new: true
      }
    );
    if (!result) {
      throw new NotModified('Cannot update course').getNotice();
    }
    return result;
  }
}

export = CourseService;
