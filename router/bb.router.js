import express from 'express'
import { ResumeController } from '../controller/resume.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

const resumeController = new ResumeController()

// 이력서 목록 조회
router.get('/resume', resumeController.findAllResume)

// 이력서 상세 조회
router.get('/resume/:resumeId', resumeController.detailResume)

// 이력서 작성
// router.post('/resume', authMiddleware, resumeController.postResume)

export default router