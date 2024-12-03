import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const getInDiscussionTrades = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { getInDiscussionTrades } = endpoints
        const accessToken = req.cookies['access_token']
        const refreshToken = req.cookies['refresh_token']

        if (!accessToken || !refreshToken) {
            return res.status(401).json({ message: 'Session expired. Please login' })
        }

        const response: AxiosResponse = await axios.get(getInDiscussionTrades, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`
            }
        })

        if(req.chat){
            // console.log('triggered chat:', response.data.inDiscussionTrades)
            return {
                inDiscussionTrades: response.data.inDiscussionTrades
            }
        }

        res.status(200).json({ message: 'success', inDiscussionTrades: response.data.inDiscussionTrades }) 
        // res.status(200).render('users/userDetails', { message: 'success', discussions: response.data.inDiscussionTrades })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
}
