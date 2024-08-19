import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const getRate = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { getSpotRate } = endpoints;
        let { from, to } = req.body;

        const response: AxiosResponse = await axios.post(getSpotRate, { from, to });

        res.status(200).json({ rate: response.data.rate })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})