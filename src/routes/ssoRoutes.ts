import { Router } from 'express'
import * as ssoController from '../controllers/ssoController'

const ssoRouter = Router()

ssoRouter.get('/sso/google', ssoController.ssoGooglePost)
ssoRouter.get('/oauth', ssoController.ssoGoogleGet)

export default ssoRouter