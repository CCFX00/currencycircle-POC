import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const offersGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('offers/createOffer', { title: 'Create Offer' })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const offersPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        
    }catch(err: any){
        // res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})