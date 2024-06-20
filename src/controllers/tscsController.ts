import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

// TsCs CONTROLLERS
// Getting latest TsCs from database
export const getLatestTcs = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { getLatestTcs } = endpoints

        const response: AxiosResponse = await axios.get(getLatestTcs)

        res.status(200).json({
            Tcstitle: response.data[0].title,
            content: response.data[0].content
        })

    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})