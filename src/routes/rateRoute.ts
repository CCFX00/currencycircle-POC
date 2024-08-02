import { Router } from 'express'
import * as rateController from '../controllers/rateController'

const rateRouter = Router()

rateRouter.post('/rate', rateController.getRate)

export default rateRouter