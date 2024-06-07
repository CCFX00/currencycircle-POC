import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'
import jwt, { sign, verify, decode } from 'jsonwebtoken';


export const getWelcome = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('welcome', {title: 'Welcome'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const getIntro = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('intro', {title: 'Welcome'})
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
            tcs: step1Data.tcs === 'true' ? true : step1Data.tcs
        };

        const response: AxiosResponse = await axios.post(signup, updatedStep1Data);

        const message = response.data.message;
        res.render('messageButton', { title: 'Message', message, endpoint: 'signup' });
    }catch(err: any) {
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message', endpoint: 'signupFail' });
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

        res.status(200).render('messageButton', { message: response.data.message , endpoint: 'forgotPassword', title: 'Forgot Password'})
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

        res.status(200).render('messageButton', {  endpoint: 'updatedPassword', message: response.data.message, title: 'Message'})
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

        const { otp, email } = req.body

        const response: AxiosResponse  = await axios.post(verifyUser, {
            email,
            otp            
        })

        res.status(200).render('users/verified', { message: response.data.verificationStatus.message, title: 'Message', endpoint: 'userVerified'})
    }catch(err: any){
        res.status(401).render('messageButton', { message: err.response.data.message, title: 'Verification Error', endpoint: 'verificationFailed' })
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

        res.status(200).render('messageButton', { message: response.data.verificationStatus.message, endpoint: 'resendOtp', title: 'Resend OTP'})
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
        res.status(200).render('welcome', {title: 'Welcome'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

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
            res.status(200).render('messageButton', { message: response.data.message, endpoint: 'loggedIn'})
        } else {
            throw new Error('Cookies not found in response headers')
        }
    } catch (err: any) {
        const message = err.response.data.message
        if (message.includes('Please verify your account to login')){
            res.status(401).render('messageButton', { message: message, endpoint: 'login', title: 'Message' });
        }else{
            res.status(401).render('messageButton', { message: message, endpoint: 'loginWrongPass', title: 'Message' });
        }        
    }
})

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

export const uploadFile = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { fileUpload } = endpoints

        console.log(req.body)

        const {email, files} = req.body

        const response:AxiosResponse = await axios.post(fileUpload, {
            email,
            files
        })

        res.status(200).json({
            response: response.data
        })
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const getUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { access_token } = req.cookies

        const decoded : any = jwt.verify(access_token, `${process.env._JWT_ACCESS_SECRET_KEY}`)

        const response: AxiosResponse = await axios.get(`http://localhost:3000/ccfx/api/v1/user/${decoded.id}`)

        res.status(200).render('users/userDetails', { user: response.data.user, title: `${response.data.user.userName}'s dashboard`, endpoint: 'getUser'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})