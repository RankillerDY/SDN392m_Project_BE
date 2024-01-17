import { NotFoundError, NotModified } from '~/core/errorResponse.core'
import courseSchema, { Course } from '~/models/course.schema'
import trackSchema, { TrackCourse } from '~/models/track.schema'
import { HydratedDocument, InsertManyResult, SchemaTypes, Types } from 'mongoose'
import userSchema from '~/models/user.schema'
import quizSchema, { Quiz } from '~/models/quiz.schema'

interface IInsertManyResult {
  insertedIds: any
}
class CourseService {
  static async getAllFreeCourses() {
    const allCourses: HydratedDocument<Course> = await courseSchema
      .find({
        type: 'free'
      })
      .sort({ created_at: -1 })
      .limit(50)
      .lean()

    if (!allCourses) {
      throw new NotFoundError('Not found any free course available!').getNotice()
    }
    return allCourses
  }

  static async getAllProCourses() {
    const allCourses: HydratedDocument<Course> = await courseSchema
      .find({
        type: 'pro'
      })
      .sort({ created_at: -1 })
      .limit(50)
      .lean()

    if (!allCourses) {
      throw new NotFoundError('Not found any pro course available!')
    }
    return allCourses
  }

  static async createCourse(course: any) {
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
    }: Course = course

    //  find user by id
    const foundUser = await userSchema.findById(lecture).lean()
    console.log('foundUser===>', foundUser)

    if (!foundUser) {
      throw new NotFoundError('Lecture id not found!').getNotice()
    }

    //  add list of quiz courses to course
    const quizAdded = await quizSchema.insertMany(quiz)
    console.log('quizAdded===>', quizAdded)
    if (!quizAdded) {
      throw new NotModified('Create quiz failed!').getNotice()
    }

    const newCourse = await courseSchema.create({
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
    })
    console.log('newCourse===>', newCourse)

    if (!newCourse) {
      throw new NotFoundError('Create course failed!').getNotice()
    }

    //  add list of tracks sub-main course to course
    const extractedTracks: TrackCourse[] = tracks.map((track: any) => {
      return {
        courseId: newCourse._id,
        chapterTitle: track.chapterTitle,
        content: track.content
      }
    })

    console.log('extractedTracks===>', extractedTracks)
    //  add track to track schema
    const trackResult = await trackSchema.insertMany(extractedTracks)
    console.log('trackResult===>', trackResult)

    if (!trackResult) {
      throw new NotModified('Create track failed!').getNotice()
    }
    const result = await courseSchema.findByIdAndUpdate(newCourse._id, {
      $addToSet: {
        tracks: trackResult
      }
    })
    console.log('result===>', result)

    // newCourse.tracks.push(trackResult)

    return {
      result,
      newCourse
    }
  }
}

export = CourseService
