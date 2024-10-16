import { Request, Response } from 'express';

export const displayTradeHistory = (req: Request, res: Response) => {
    // Example data fetching logic for trade history
    const tradeHistoryData = [
        // Sample trade history data (replace with real data fetching logic from the database)
        { tradeId: 1, date: '2024-10-01', status: 'Completed', amount: '100 USD', partner: 'User A' },
        { tradeId: 2, date: '2024-10-05', status: 'Cancelled', amount: '50 EUR', partner: 'User B' },
    ];

    // Render the trade history page (ensure the view path is correct)
    res.render('tradehistory/tradehistory', {
        title: 'Trade History',
        trades: tradeHistoryData,  // Pass the fetched data to the template
    });
};
