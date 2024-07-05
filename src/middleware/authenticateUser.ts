import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['access_token']
    const refreshToken = req.cookies['refresh_token']

    if (!accessToken || !refreshToken) {
        // return res.status(401).json({ message: 'Session expired. Please login.' })
        return res.status(401).render('messageButton', { message: 'Session expired. Please Login', endpoint: 'loginFail' })
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, `${process.env._JWT_ACCESS_SECRET_KEY}`)

        if(!decoded){
            
        }

        req.user = decoded // Assuming the token contains user information
        next();
    } catch (err) {
        // return res.status(401).json({ message: 'Session expired. Please Login' })
        return res.status(401).render('messageButton', { message: 'Session expired. Please Login', endpoint: 'loginFail' })
    }
};

export default authenticateUser;
