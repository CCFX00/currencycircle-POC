import { Router } from 'express'
import * as otpController from '../controllers/otpController'

const otpRouter = Router()

otpRouter.get('/resend', otpController.resendOtpGet)
otpRouter.post('/resend', otpController.resendOtpPost)

export default otpRouter