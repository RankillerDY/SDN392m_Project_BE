import { Response, Request } from 'express'
import { OK } from '~/core/successResponse.core'
import CourseService from '~/services/course.services'

class CourseController {
  async getFreeCourse(req: Request, res: Response) {
    return new OK({
      message: 'Get all free course successfully !',
      metadata: await CourseService.getAllFreeCourses()
    }).send(res)
  }

  async getProCourse(req: Request, res: Response) {
    return new OK({
      message: 'Get all pro course successfully !',
      metadata: await CourseService.getAllProCourses()
    }).send(res)
  }

  async createCourse(req: Request, res: Response) {
    return new OK({
      message: 'Create course successfully !',
      metadata: await CourseService.createCourse(req.body)
    }).send(res)
  }
}

export = new CourseController()
