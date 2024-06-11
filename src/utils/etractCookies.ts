import { Request, Response, NextFunction } from 'express'


export const extractCookies = (req: Request) => {
    const cookies = req.cookies;
    // Convert cookies object into a string suitable for the Cookie header
    const cookieHeader = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');

    const { access_token } = cookies;

    return {cookieHeader, access_token}
}