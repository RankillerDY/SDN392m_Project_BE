import { Router } from 'express'
import courseController from '~/controllers/course.controller'
import { asyncHandler } from '~/helper/asyncHandler'

const router = Router()

router.get('/free-course', asyncHandler(courseController.getFreeCourse))
router.post('/create-course', asyncHandler(courseController.createCourse))
router.get('/pro-course', asyncHandler(courseController.getProCourse))

export default router
