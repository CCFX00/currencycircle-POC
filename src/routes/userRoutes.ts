import { Router } from 'express'
import * as userController from '../controllers/userController'
import multer from 'multer';

const userRouter = Router()

userRouter.get('/test', userController.test)
userRouter.get('/', userController.getWelcome)
userRouter.get('/intro', userController.getIntro)
userRouter.get('/signup', userController.signupGet1)
userRouter.get('/register2', userController.signupGet2)
userRouter.post('/signup', userController.signupPost)
userRouter.get('/logout', userController.logoutGet)
userRouter.get('/login', userController.loginGet)
userRouter.post('/login', userController.loginPost)
userRouter.get('/password/forgot', userController.forgotPasswordGet)
userRouter.post('/password/forgot', userController.forgotPasswordPost)
userRouter.get('/password/reset/:tkn', userController.resetPasswordGet)
userRouter.post('/password/reset', userController.resetPasswordPost)
userRouter.get('/verify', userController.verificationGet)
userRouter.post('/verify', userController.verificationPost)
userRouter.post('/upload', multer().any(), userController.uploadFile)
// userRouter.get('/user', userController.getUsers)

export default userRouter