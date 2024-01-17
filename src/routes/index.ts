import { Router } from 'express'
import courseRouter from './course'
import authRouter from './auth/index'

const router = Router()

router.use('/course', courseRouter)
router.use('/auth', authRouter)
export { router as Routes }
