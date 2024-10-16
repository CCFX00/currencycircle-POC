import { Router } from 'express';
import * as tradeHistoryController from '../controllers/tradeshistoryController';
import authenticateUser from '../middleware/authenticateUser'; // Assuming you have authentication middleware

const tradeHistoryRouter = Router();

// Route for rendering the trade history page
tradeHistoryRouter.get('/tradehistory', authenticateUser, tradeHistoryController.displayTradeHistory);

export default tradeHistoryRouter;
