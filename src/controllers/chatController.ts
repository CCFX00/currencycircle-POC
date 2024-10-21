import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import catchAsyncErrors from '../middleware/catchAsyncErrors'

export const displayChatGet = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('chats/chat', { message: 'success', title: 'Chat' })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

// export const displayChatPost = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         console.log(req.body);
//         // Render the chat template directly
//         res.status(200).render('chats/chat', { message: 'success', title: 'Chat' });
//     } catch (err: any) {
//         res.status(401).json({ status: err.response.data.success, message: err.response.data.message });
//     }
// });
