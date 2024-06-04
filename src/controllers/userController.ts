import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'


export const loginPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { login } = endpoints
        const { email, password } = req.body

        const response: AxiosResponse = await axios.post(login, {
            email,
            password
        })

        // Get cookies from response headers
        const cookies: string[] | undefined = response.headers['set-cookie']

        if (cookies) {
            let accessToken: string | undefined
            let refreshToken: string | undefined
            let sessionToken: string | undefined

            // Extract tokens from cookies
            cookies.forEach(cookie => {
                if (cookie.startsWith('access_token=')) {
                    accessToken = cookie.split('=')[1].split(';')[0]
                } else if (cookie.startsWith('refresh_token=')) {
                    refreshToken = cookie.split('=')[1].split(';')[0]
                } else if (cookie.startsWith('connect.sid=')) {
                    sessionToken = cookie.split('=')[1].split(';')[0]
                }
            });

            // Check if all tokens are present
            if (!accessToken || !refreshToken || !sessionToken) {
                throw new Error('One or more tokens not found in response cookies')
            }

            // Set tokens in your TypeScript app's cookies
            res.cookie('access_token', accessToken, { httpOnly: true })
            res.cookie('refresh_token', refreshToken, { httpOnly: true })
            res.cookie('connect.sid', sessionToken, { httpOnly: true })

            // Respond with a success message or other data if needed
            res.status(200).render('messageButton', { message: response.data.message, data: 'loggedIn'})
        } else {
            throw new Error('Cookies not found in response headers')
        }
    } catch (err: any) {
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' });
    }
})

export const redirectHome = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.redirect('/intro1')
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const getIntro1 = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('intro1', {title: 'Welcome'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const getIntro2 = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('intro2', {title: 'Welcome'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const signupGet1 = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('users/register1', {title: 'Signup Step 1'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const signupGet2 = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('users/register2', {title: 'Signup Step 2'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const signupPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { signup } = endpoints;

        // Extract data from step 1
        const step1Data = JSON.parse(req.body.step1Data);

        // Update tcs to true if it's "true"
        const updatedStep1Data = {
            ...step1Data,
            tcs: step1Data.tcs === "true" ? true : step1Data.tcs
        };

        const response: AxiosResponse = await axios.post(signup, updatedStep1Data);

        const message = response.data.message;
        res.render('message', { title: 'Message', message });
    }catch(err: any) {
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' });
    }
});

export const logoutGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { logout } = endpoints

        const response: AxiosResponse = await axios.get(logout)

        res.render('message', { message: response.data.message})
    }catch(err: any) {
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' });
    }
})

export const loginGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('users/login', { title: 'User Login'})
    }catch(err){
        res.render('message', { message: err })
    }
})

export const ssoGoogle = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {oauthGoogle} = endpoints

        const response: AxiosResponse = await axios.get(oauthGoogle)

        // res.redirect(oauthGoogle)

    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const forgotPasswordGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/forgotPassword', {title: 'Forgot Password'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const forgotPasswordPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { forgotPassword } = endpoints

        const { email } = req.body        
        
        const response: AxiosResponse = await axios.post(forgotPassword, {
            email
        })

        res.status(200).render('messageButton', { message: response.data.message , data: 'forgotPassword', title: 'Forgot Password'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const resetPasswordGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/resetPassword', {title: 'Reset Password'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const resetPasswordPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { resetPassword } = endpoints

        const { otp, password, confirmPassword } = req.body    

        const response: AxiosResponse = await axios.put(resetPassword, {
            otp,
            password,
            confirmPassword
        })

        res.status(200).render('messageButton', {  data: 'updatedPassword', message: response.data.message, title: 'Message'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const verificationGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/verification', {title: 'Verification'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const verificationPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { verifyUser } = endpoints

        const { code } = req.body

        const response: AxiosResponse  = await axios.post(verifyUser, {
            code
        })

        res.status(200).render('users/virified', { title: 'User Verified' })
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

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

        res.status(200).render('messageButton', { message: response.data.message, data: 'resendOtp'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const userGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { getUser } = endpoints

        const response: AxiosResponse = await axios.post(getUser)

        res.status(200).render('users/userDetails', {title: 'User Details'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const test = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

