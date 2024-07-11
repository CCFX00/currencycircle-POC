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

        res.status(200).json({ message: 'success', matches: response.data.matches })        
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})