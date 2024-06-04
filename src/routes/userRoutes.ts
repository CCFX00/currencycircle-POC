import { Router } from 'express'
import * as userController from '../controllers/userController'

const userRouter = Router()

userRouter.get('/', userController.redirectHome)
userRouter.get('/intro1', userController.getIntro1)
userRouter.get('/intro2', userController.getIntro2)
userRouter.get('/signup', userController.signupGet1)
userRouter.get('/register2', userController.signupGet2)
userRouter.post('/signup', userController.signupPost)
userRouter.get('/logout', userController.logoutGet)
userRouter.get('/login', userController.loginGet)
userRouter.post('/login', userController.loginPost)
userRouter.get('/sso/google', userController.ssoGoogle)
userRouter.get('/password/forgot', userController.forgotPasswordGet)
userRouter.post('/password/forgot', userController.forgotPasswordPost)
userRouter.get('/password/reset', userController.resetPasswordGet)
userRouter.post('/password/reset', userController.resetPasswordPost)
userRouter.get('/verify', userController.verificationGet)
userRouter.post('/verify', userController.verificationPost)


export default userRouter