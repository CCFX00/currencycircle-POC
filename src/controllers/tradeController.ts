import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const getMatchedTrades = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { displayMatchedTrades } = endpoints
        const accessToken = req.cookies['access_token']
        const refreshToken = req.cookies['refresh_token']
        const userOfferId = req.params.id  

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ message: 'Session expired. Please login' })
        }

        const response: AxiosResponse = await axios.post(displayMatchedTrades, { userOfferId } ,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            }
        })

        res.status(200).json({ message: 'success', matches: response.data.matches, userOffer: response.data.userOffer }) 
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const getAllMatchedTrades = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { displayAllMatchedTrades } = endpoints
        const accessToken = req.cookies['access_token']
        const refreshToken = req.cookies['refresh_token'] 

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ message: 'Session expired. Please login' })
        }

        const response: AxiosResponse = await axios.get(displayAllMatchedTrades, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            }
        })

        res.status(200).json({ message: 'success', matches: response.data.allMatchedOffers, userOffer: response.data }) 
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})


export const displayTradeHistory = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{

        res.render('tradeHistory/tradeHistory', { message: 'success', title: 'Trade History' })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})


export const getAllCompletedTrades = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { getAllCompletedTrades } = endpoints
        const accessToken = req.cookies['access_token']
        const refreshToken = req.cookies['refresh_token'] 
        const { _id: userId } = JSON.parse(req.cookies['user'])

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ message: 'Session expired. Please login' })
        }

        const response: AxiosResponse = await axios.post(getAllCompletedTrades, { userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            }
        })

        // console.log(response.data.completedTrades[0]) 
        // console.log(`user1: ${response.data.completedTrades[0].senderId}, user2: ${response.data.completedTrades[0].receiverId}, offer: ${response.data.completedTrades[0].offerId}`)
        
        res.status(200).json({ message: 'success', completedTrades: response.data.completedTrades }) 
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const getAllCancelledTrades = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { getAllCancelledTrades } = endpoints
        const accessToken = req.cookies['access_token']
        const refreshToken = req.cookies['refresh_token'] 
        const { _id: userId } = JSON.parse(req.cookies['user'])

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ message: 'Session expired. Please login' })
        }

        const response: AxiosResponse = await axios.post(getAllCancelledTrades, { userId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            }
        })

        // res.render('tradeHistory/tradeHistory', { message: 'success', title: 'Trade History', cancelledTrades: response.data.cancelledTrades })
        res.status(200).json({ message: 'success', cancelledTrades: response.data.cancelledTrades }) 
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})