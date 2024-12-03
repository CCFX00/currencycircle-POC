import axios, { AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import catchAsyncErrors from '../middleware/catchAsyncErrors'
import * as discussionController from '../controllers/discussionController'

export const displayChat = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('chats/chat', { message: 'success', title: 'Chat' })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const displayAllChats = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.status(200).render('chats/chatHistory', { message: 'success', title: 'Chat History' })
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})

export const returnAllChats = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try{
        req.chat = true; // setting the chat parameter to true to alter the response in the getInDiscussionTrades so that it returns the object
        const inDiscussionTrades = await discussionController.getInDiscussionTrades(req, res, next)

        res.status(200).json({ result: inDiscussionTrades }) 
    }catch(err: any){
        res.status(401).json({ status: err.response.data.success, message: err.response.data.message })
    }
})