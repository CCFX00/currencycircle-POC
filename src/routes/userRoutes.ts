import { Router } from 'express'
import * as userController from '../controllers/userController'

const userRouter = Router()

userRouter.get('/', userController.redirectHome)
userRouter.get('/intro1', userController.getIntro1)
userRouter.get('/intro2', userController.getIntro2)
userRouter.get('/signup', userController.signupGet1)
userRouter.get('/register2', userController.signupGet2)
userRouter.post('/signup', userController.signupPost)


export default userRouter