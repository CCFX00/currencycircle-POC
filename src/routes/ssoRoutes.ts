import { Router } from 'express'
import * as ssoController from '../controllers/ssoController'

const userRouter = Router()

userRouter.get('/sso/google', ssoController.ssoGooglePost)
userRouter.get('/oauth', ssoController.ssoGoogleGet)

export default userRouter