import { Router } from 'express';
import courseController from '~/controllers/course.controller';
import { asyncHandler } from '~/helper/asyncHandler';
import { isAuthenticated } from '~/middleware/authenticate';

const courseRouter = Router();

courseRouter.get('/decrease', asyncHandler(courseController.getAllCoursesDecrease));
courseRouter.get('/free-course', asyncHandler(courseController.getFreeCourse));
courseRouter.post('/create-course', asyncHandler(courseController.createCourse));
courseRouter.get('/pro-course', asyncHandler(courseController.getProCourse));
courseRouter.get('/semester/:id', asyncHandler(courseController.getCourseBySemester));
courseRouter.get('/get-course/:id', asyncHandler(courseController.getCourseById));
courseRouter.post('/enroll-course', isAuthenticated, asyncHandler(courseController.enrollCourse));
courseRouter.get('/get-tracks-by-id/:courseId', asyncHandler(courseController.getAllTracksWithId));

export default courseRouter;
