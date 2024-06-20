import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import { endpoints } from './endpoints'
import catchAsyncErrors from '../middleware/catchAsyncErrors'
import { extractCookies } from '../utils/etractCookies'

// SSO CONTROLLERS
// SSO with Google
export const ssoGoogleGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {oauthGoogleGet} = endpoints
        const { cookieHeader, access_token }: any = extractCookies(req)

        const response: AxiosResponse = await axios.get(oauthGoogleGet, {
            headers: {
                Cookie: cookieHeader
            }
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
            if (!accessToken || !refreshToken ) {
                throw new Error('One or more tokens not found in response cookies')
            }

            // Set tokens in your TypeScript app's cookies
            res.cookie('access_token', accessToken, { httpOnly: true })
            res.cookie('refresh_token', refreshToken, { httpOnly: true })

            // Respond with a success message or other data if needed
            res.status(200).render('users/userDetails', { user: response.data.user, title: `${response.data.user.userName}'s dashboard`, endpoint: 'getUser' })
        } else {
            throw new Error('Cookies not found in response headers')
        }
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message, data: err.response.data.success, title: 'Message' })
    }
})

export const ssoGooglePost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {oauthGooglePost} = endpoints

        // const response: AxiosResponse = await axios.get(oauthGoogle)

        res.redirect(oauthGooglePost)
    }catch(err: any){
        res.status(401).render('message', { message: err.response.data.message , data: err.response.data.success, title: 'Message' })
    }
})
