import express from 'express';
import { prisma } from "../src/utils/prisma/index.js";
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 이력서 작성
// router.post('/resume', authMiddleware, async(req, res, next) => {
//     const { resumeTitle, selfIntroduce, profileImage, name, age, address, contact } = req.body     // 이력서인데 이정돈 써야지
//     const { userId } = req.locals.user  // 검증된 사용자의 userId

//     const resume = await prisma.resume.create({     // resume에다 생성할 것이다.
//         data : {
//             resumeId : resume.resumeId,
//             userId : +userId,
//             resumeTitle,
//             authorsName,
//             selfIntroduce,
//             profileImage,
//             name,
//             age,
//             address,
//             contact,
//         }
//     })
//     return res.status(201).json({ message : '이력서 작성 완료'})
// })

// 이력서 조회 (전체)
// router.get('/resume', async(req, res, next) => {
//     const orderKey = req.query
//     const orderValue = req.query

// })

export default router;