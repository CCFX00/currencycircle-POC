import { Router } from 'express'
import * as offerController from '../controllers/offerController'
import authenticateUser from '../middleware/authenticateUser';

const offerRouter = Router()

offerRouter.get('/offer/create', authenticateUser, offerController.offersGet)
offerRouter.post('/offer/create', authenticateUser, offerController.offersPost)

export default offerRouter