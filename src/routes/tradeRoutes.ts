import { Router } from 'express'
import * as tradesController from '../controllers/tradeController'
import authenticateUser from '../middleware/authenticateUser';

const tradeRouter = Router()

tradeRouter.get('/trade/:id', authenticateUser, tradesController.getMatchedTrades)

export default tradeRouter