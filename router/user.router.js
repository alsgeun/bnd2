import express from 'express'
import { UserController } from '../controller/users.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

const userController = new UserController()


// 회원가입 api
router.post('/sign-up', userController.signUp)

// 로그인 api
router.post('/sign-in', userController.signIn)

// 사용자 정보 조회 api
router.get('/users', authMiddleware, userController.infoUser)






export default router