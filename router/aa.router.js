import express from 'express'
import { UserController } from '../controller/users.controller.js'

const router = express.Router()

const userController = new UserController()


// 회원가입 api
router.post('/sign-up', userController.signUp)

// 로그인 api
// router.post('/sign-in', userController.signIn)






export default router