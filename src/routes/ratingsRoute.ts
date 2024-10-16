import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/userratings', (req: Request, res: Response) => {
    res.render('ratings/userratings');  // Ensure path is correct
});

export default router;
