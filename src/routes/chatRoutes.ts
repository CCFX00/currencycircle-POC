import { Router } from 'express'
import * as chatController from '../controllers/chatController'
import authenticateUser from '../middleware/authenticateUser';

const chatRouter = Router()

chatRouter.get('/chat', authenticateUser, chatController.displayChat)

export default chatRouter