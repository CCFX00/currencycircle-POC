import { Router } from 'express'
import * as discussionController from '../controllers/discussionController'
import authenticateUser from '../middleware/authenticateUser';

const discussionRouter = Router()

discussionRouter.get('/discussions/all', authenticateUser, discussionController.getInDiscussionTrades)

export default discussionRouter