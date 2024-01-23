import { Response, Request } from 'express';
import { MESSAGE } from '~/constants';
import { CREATED, OK } from '~/core/successResponse.core';
import CourseService from '~/services/course.services';

class CourseController {
  async getFreeCourse(req: Request, res: Response) {
    return new OK({
      message: MESSAGE.GET_COURSE_SUCCESS,
      metadata: await CourseService.getAllFreeCourses()
    }).send(res);
  }

  async getAllCoursesDecrease(req: Request, res: Response) {
    return new OK({
      message: MESSAGE.GET_COURSE_SUCCESS,
      metadata: await CourseService.getAllCoursesDecrease()
    }).send(res);
  }

  async getProCourse(req: Request, res: Response) {
    return new OK({
      message: MESSAGE.GET_COURSE_PRO_SUCCESS,
      metadata: await CourseService.getAllProCourses()
    }).send(res);
  }

  async createCourse(req: Request, res: Response) {
    return new CREATED({
      message: MESSAGE.CREATED_COURSE_SUCCESS,
      metadata: await CourseService.createCourse(req.body)
    }).send(res);
  }

  async getCourseBySemester(req: Request, res: Response) {
    const parseId = parseInt(req.params.id);
    return new OK({
      message: MESSAGE.GET_COURSE_SEMESTER_SUCCESS,
      metadata: await CourseService.getCourseBySemesterNumber(parseId)
    }).send(res);
  }

  async getCourseById(req: Request, res: Response) {
    const courseId = req.params.id;
    try {
      const metadata = await CourseService.getCourseById(courseId);
      const message = MESSAGE.GET_COURSE_SUCCESS;
      return new OK({
        message,
        metadata
      }).send(res);
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async enrollCourse(req: Request, res: Response) {
    const { courseId, userId } = req.body;
    return new CREATED({
      message: MESSAGE.ENROLL_COURSE_SUCCESS,
      metadata: await CourseService.enrollCourse(courseId, userId)
    }).send(res);
  }

  async getAllTracksWithId(req: Request, res: Response) {
    const { courseId } = req.params;
    return new OK({
      message: MESSAGE.GET_TRACKS_WITH_COURSE_ID_SUCCESS,
      metadata: await CourseService.getAllTracksByCourseId(courseId)
    }).send(res);
  }
}

export = new CourseController();
