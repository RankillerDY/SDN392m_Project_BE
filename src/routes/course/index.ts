import { Router } from 'express';
import { USER_ROLE } from '~/constants';
import courseController from '~/controllers/course.controller';
import trackController from '~/controllers/track.controller';
import { asyncHandler } from '~/helper/asyncHandler';
import { authorizeRoles, isAuthenticated } from '~/middleware/authenticate';

const courseRouter = Router();

courseRouter.get('/decrease', asyncHandler(courseController.getAllCoursesDecrease));
courseRouter.get('/free-course', asyncHandler(courseController.getFreeCourse));
courseRouter.post(
  '/create-course',
  isAuthenticated,
  authorizeRoles([USER_ROLE.TEACHER]),
  asyncHandler(courseController.createCourse)
);
courseRouter.get('/pro-course', asyncHandler(courseController.getProCourse));
courseRouter.get('/semester/:id', asyncHandler(courseController.getCourseBySemester));
courseRouter.get('/:id', asyncHandler(courseController.getCourseById));
courseRouter.post('/:courseId/enroll-course', isAuthenticated, asyncHandler(courseController.enrollCourse));
courseRouter.get('/:courseId/get-tracks', asyncHandler(courseController.getAllTracksWithId));

courseRouter.use(isAuthenticated);
courseRouter.use(authorizeRoles([USER_ROLE['TEACHER']]));

courseRouter.delete('/:courseId/delete-many-tracks', asyncHandler(trackController.deleteManyTracks));
courseRouter.delete('/:courseId/delete-track/:trackId', asyncHandler(trackController.deleteTrackById));
courseRouter.post('/:courseId/create-tracks', asyncHandler(trackController.createTracks));

export default courseRouter;
