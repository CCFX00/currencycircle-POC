import { Router } from 'express'
import * as otpController from '../controllers/otpController'

const userRouter = Router()

userRouter.get('/resend', otpController.resendOtpGet)
userRouter.post('/resend', otpController.resendOtpPost)

export default userRouter