import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    err.message = err.message || 'Internal server error';
    err.statusCode = err.statusCode || 500;

    if (err.name === 'CastError') {
        const message = `Resource not found with this id...Invalid ${err.path}`;
        err = new ErrorHandler(message, 404);
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    });
};
