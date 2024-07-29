import { Router } from 'express'
import * as tscsController from '../controllers/tscsController'

const tscsRouter = Router()

tscsRouter.get('/tcs/latest', tscsController.getLatestTcs)

export default tscsRouter