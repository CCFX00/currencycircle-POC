import { Request, Response, NextFunction } from 'express'


export const extractCookies = (req: Request) => {
    const { access_token } = req.cookies;
    
    // Convert cookies object into a string suitable for the Cookie header
    const cookieHeader = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

    return {cookieHeader, access_token}
}