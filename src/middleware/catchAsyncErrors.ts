import { Request, Response, NextFunction } from 'express';

const catchAsyncErrors = (thefunc: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(thefunc(req, res, next)).catch(next);
    };

export default catchAsyncErrors;
