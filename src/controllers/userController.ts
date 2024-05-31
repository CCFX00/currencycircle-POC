import axios, { AxiosResponse } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'


export const login = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
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
            res.json({ message: 'Login successful' })
        } else {
            throw new Error('Cookies not found in response headers')
        }
    } catch (error) {
        next(error)
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
    } catch (err: any) {
        const errorMessage = err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : 'An error occurred during signup';
        res.status(401).render('message', { message: errorMessage , title: 'Message'});
    }
});

