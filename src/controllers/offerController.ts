import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const offersGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{

        // const response3: AxiosResponse = await axios.post(getRate, { from: "USD", to: response1.data.user.country })
 
        // res.cookie('userCurrency', JSON.stringify(response1.data.user.country), { httpOnly: true })
        // res.cookie('rate', JSON.stringify(response3.data.rate), { httpOnly: true })

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