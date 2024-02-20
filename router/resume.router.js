import express from "express";
import { prisma } from "../src/utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 작성
router.post("/resume", authMiddleware, async (req, res, next) => {
  const {
    resumeTitle,
    selfIntroduce,
    profileImage,
    name,
    age,
    address,
    contact,
  } = req.body; // 이력서인데 이정돈 써야지
  const { userId } = req.locals.user; // 검증된 사용자의 userId

  const resume = await prisma.resume.create({
    // resume에다 생성할 것이다.
    data: {
      userId: +userId,
      resumeTitle,
      selfIntroduce,
      profileImage,
      name,
      age,
      address,
      contact,
    },
  });
  return res.status(201).json({ message : "이력서 작성 완료", resume });
});

// 이력서 목록 조회
router.get('/', async (req, res) => {
    const orderKey = req.query.orderKey ?? 'resumeId';
    const orderValue = req.query.orderValue ?? 'desc';

    if (!['resumeId', 'status'].includes(orderKey)) {
        return res.status(400).json({
            success: false,
            message: 'orderKey 가 올바르지 않습니다.'
        })
    }

    if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: 'orderValue 가 올바르지 않습니다.'
        })
    }

    const resumes = await prisma.resume.findMany({
        select: {
            resumeId: true,
            userId: true,
            resumeTitle: true,
            resumeStatus: true,
            name:true,
            userInfos: {
                select: {
                    character: true,
                }
            },
            createdAt: true,
        },
        orderBy: [
            {
                [orderKey]: orderValue.toLowerCase(),
            }
        ]
    })

    return res.json({ data: resumes });
})

export default router;
