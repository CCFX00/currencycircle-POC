import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const offersGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = JSON.parse(req.cookies['user'])
        const { getSpotRate } = endpoints
       
        const response: AxiosResponse = await axios.post(getSpotRate, {  from: user.currency , to: user.currency })            
        
        res.status(200).render('offers/createOffer', { title: 'Create Offer', userCurrency: user.currency, rate: response.data.rndRate, currencyTo: user.currency,  currencyFrom: user.currency})
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const offersPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { createOffer } = endpoints
        const accessToken = req.cookies['access_token']
        const refreshToken = req.cookies['refresh_token']

        let { from, to, amount, value, rate } = req.body

        const response: AxiosResponse = await axios.post(createOffer, { from, to, amount, value, rate }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            }
        })

        res.status(201).json({ message: 'offer created successfully', offer: response.data.offer }) 
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})