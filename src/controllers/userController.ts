import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'
import jwt, { sign, verify, decode } from 'jsonwebtoken'
import { extractCookies } from '../utils/etractCookies'
import { displayError } from '../utils/getError'
import FormData from 'form-data';

// TEST CONTROLLER
export const test = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/verified', {title: 'User Details'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

// INTRO CONTROLLERS
export const getWelcome = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('intro/welcome', {title: 'Welcome'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

export const getIntro = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('intro/intro', {title: 'Welcome'})
    }catch(err){
        res.status(404).render('message', {message: err})
    }
})

// AUTH CONTROLLERS
// Signing up
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
        const response: AxiosResponse = await axios.post(signup, updatedStep1Data)

        res.cookie('email', updatedStep1Data.email, { httpOnly: true })
        res.status(200).render('users/verification', {title: 'Verification', userPhone: response.data.user.phoneNumber.slice(0, -4) })
    }catch(err: any) {
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message', endpoint: 'signupFail' });
    }
});

// Logging in
export const loginGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.render('users/login', { title: 'User Login'})
    }catch(err){
        res.render('message', { message: err })
    }
})

export const loginPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { login, getOffers } = endpoints
        const { email, password } = req.body

        const response1: AxiosResponse = await axios.post(login, {
            email,
            password
        })

        if(response1){
            // Get cookies from response headers
            const cookies: string[] | undefined = response1.headers['set-cookie']

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

                const response3: AxiosResponse = await axios.get(getOffers, {
                    headers: {
                        Cookie: cookies 
                    }
                })

                if(response3){
                    // Check if all tokens are present
                    if (!accessToken || !refreshToken || !sessionToken) {
                        throw new Error('One or more tokens not found in response cookies')
                    }

                    // Set tokens in your TypeScript app's cookies
                    res.cookie('access_token', accessToken, { httpOnly: true })
                    res.cookie('refresh_token', refreshToken, { httpOnly: true })
                    res.cookie('connect.sid', sessionToken, { httpOnly: true })
                }
 
                // res.cookie('user', JSON.stringify(response2.data.user), { httpOnly: true, maxAge: 300000 })
                // Respond with a success message or other data if needed
                // res.status(200).render('messageButton', { message: response.data.message, endpoint: 'loggedIn'}) 
                // res.status(200).render('users/userDetails', { user: response2.data.user, title: `${response2.data.user.userName}'s dashboard`, endpoint: 'getUser' })
                res.status(200).render('users/userDetails', { user: response1.data.user, title: `${response1.data.user.userName}'s dashboard`, offers: response3.data.offers, endpoint: 'getUser' })
            } else {
                throw new Error('Cookies not found in response headers')
            }
        }
        
    } catch (err: any) {
        const message = err.response.data.message
        // res.status(401).render('messageButton', { message: message, endpoint: 'loginWrongPass', title: 'Message' })
        res.status(401).json({ status: err.response.data.success, message: message })

        // if (message.includes('Please verify your account to login')){
        //     res.status(401).render('messageButton', { message: message, endpoint: 'login', title: 'Message' });
        // }else{
        //     res.status(401).render('messageButton', { message: message, endpoint: 'loginWrongPass', title: 'Message' });
        // }        
    }
})

// Logging out
export const logoutGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { logout } = endpoints

        const response: AxiosResponse = await axios.get(logout)

        res.clearCookie("access_token", { expires: new Date(Date.now()), httpOnly: true })
        res.clearCookie("refresh_token", { expires: new Date(Date.now()), httpOnly: true })
        res.clearCookie("connect.sid", { httpOnly: true });

        // res.render('messageButton', { message: response.data.message, endpoint: 'logoutSuccess'})
        res.render('users/login', { title: 'User Login'})
    }catch(err: any) {
        res.status(401).render('messageButton', { message: err.response.data.message , data: err.response.data.success, title: 'Message', endpoint: 'logoutError' });
    }
})

// Forgotten password
export const forgotPasswordGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/forgotPassword', {title: 'Forgot Password'})
    }catch(err: any){
        // res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const forgotPasswordPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { forgotPassword } = endpoints

        const { email } = req.body     
        
        const response: AxiosResponse = await axios.post(forgotPassword, {
            email
        })

        res.status(200).render('users/resetPassword', { title: 'Reset Password', response: response.data.message })
        // res.status(200).render('messageButton', { message: response.data.message , endpoint: 'forgotPassword', title: 'Forgot Password'})
    }catch(err: any){
        // res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

// Resetting password
export const resetPasswordGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.cookie('tkn', req.params.tkn, { httpOnly: true })
        res.status(200).render('users/resetPassword', {title: 'Reset Password'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const resetPasswordPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { resetPassword } = endpoints

        const { password, confirmPassword } = req.body
        const { tkn } = req.cookies  

        const response: AxiosResponse = await axios.put(resetPassword, {
            tkn,
            password,
            confirmPassword
        })

        res.clearCookie('tkn', { expires: new Date(Date.now()), httpOnly: true })
        // res.status(200).render('messageButton', {  endpoint: 'updatedPassword', message: response.data.message, title: 'Message'})
        res.render('users/login', { title: 'User Login', message: response.data.message })
    }catch(err: any){
        // res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

// VERIFICATION CONTROLLERS
export const verificationGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('users/verification', {title: 'Verification'})
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})

export const verificationPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { verifyUser } = endpoints

        const { otp } = req.body
        const { email } = req.cookies

        const response: AxiosResponse = await axios.post(verifyUser, {
            email,
            otp
        })

        res.clearCookie('email', { expires: new Date(Date.now()), httpOnly: true })
        res.status(200).render('users/verified', { message: response.data.verificationStatus.message, title: 'Message', endpoint: 'userVerified' })
    } catch (err: any) {
        res.status(401).render('messageButton', { message: err.response.data.message, title: 'Verification Error', endpoint: 'verificationFailed' })
    }
})

// USER APIs
// Getting users
// export const getUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { cookieHeader, access_token }: any = extractCookies(req)

//         if (!access_token) {
//             throw new Error("Please login to access this resource");
//         }

//         const decoded: any = jwt.verify(access_token, `${process.env._JWT_ACCESS_SECRET_KEY}`)

//         const response: AxiosResponse = await axios.get(`http://localhost:3000/ccfx/api/v1/user/${decoded.id}`, {
//             headers: {
//                 Cookie: cookieHeader
//             }
//         })

//         res.status(200).render('users/userDetails', { user: response.data.user, title: `${response.data.user.userName}'s dashboard`, endpoint: 'getUser' })
//     } catch (err: any) {
//         const { errorMessage, status, success } = displayError(err)

//         res.status(status).render('messageButton', { message: errorMessage, data: success, title: 'Message', endpoint: 'loginFail' });
//     }
// });

// Uploading a file
export const uploadFile = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileUpload } = endpoints;
        const email = req.body.email;
        const files: any = req.files;

        const file = files[0];

        // Create a FormData object to mimic the multipart/form-data payload
        const formData = new FormData();
        formData.append('email', email);
        formData.append('file', file.buffer, file.originalname);

         // Ensure axios uses the correct headers for multipart/form-data
         const response: AxiosResponse = await axios.post(fileUpload, formData, {
            headers: {
                ...formData.getHeaders(), // Add multipart/form-data headers
            },
        });

        res.status(200).json({
            success: true,
            message: response.data.message,
            response: response.data
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'An error occurred during file upload.',
            error: err.message
        });
    }
});
