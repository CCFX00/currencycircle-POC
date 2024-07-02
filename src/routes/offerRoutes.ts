import { Router } from 'express'
import * as offerController from '../controllers/offerController'

const offerRouter = Router()

offerRouter.get('/offer/create', offerController.offersGet)
offerRouter.post('/offer/create', offerController.offersPost)

export default offerRouter