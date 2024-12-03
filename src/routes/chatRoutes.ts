import { Router } from 'express'
import * as chatController from '../controllers/chatController'
import authenticateUser from '../middleware/authenticateUser';

const chatRouter = Router()

chatRouter.get('/chat', authenticateUser, chatController.displayChat)
// chatRouter.get('/chats', authenticateUser, chatController.displayAllChats)
chatRouter.get('/chats/all', authenticateUser, chatController.returnAllChats)

export default chatRouter