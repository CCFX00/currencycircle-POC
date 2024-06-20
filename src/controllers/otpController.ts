import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

// OTP CONTROLLERS
export const resendOtpGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/resendVerification', {title: 'Verification'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const resendOtpPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { resendUserOTP } = endpoints

        const { email } = req.body

        const response: AxiosResponse = await axios.post(resendUserOTP, {
            email
        })

        res.status(200).render('messageButton', { message: response.data.verificationStatus.message, endpoint: 'resendOtp', title: 'Resend OTP'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})
