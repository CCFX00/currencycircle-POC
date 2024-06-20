import { Router } from 'express'
import * as tscsController from '../controllers/tscsController'

const userRouter = Router()

userRouter.get('/tcs/latest', tscsController.getLatestTcs)

export default userRouter