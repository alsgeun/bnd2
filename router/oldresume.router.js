import express from "express";
import { prisma } from "../src/utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 이력서 작성
// router.post("/resume", authMiddleware, async (req, res, next) => {
//     // controller
//     const {
//     resumeTitle,
//     selfIntroduce,
//     profileImage,
//     name,
//     age,
//     address,
//     contact,
//   } = req.body; // 이력서인데 이정돈 써야지
//   const { userId } = req.locals.user; // 검증된 사용자의 userId

//   if (!resumeTitle) {
//     return res.status(401).json ({ message : "이력서 제목을 입력하세요." })
//   }
//   if (!name) {
//     return res.status(401).json ({ message : "이름을 입력하세요." })
//   }
//   if (!age) {
//     return res.status(401).json ({ message : "나이를 입력하세요." })
//   }
//   if (!address) {
//     return res.status(401).json ({ message : "주소를 입력하세요." })
//   }
//   if (!contact) {
//     return res.status(401).json ({ message : "연락처를 입력하세요." })
//   }

//   // repository
//   const resume = await prisma.resume.create({
//     // resume에다 생성할 것이다.
//     data: {
//         // service
//       userId: +userId,
//       resumeTitle,
//       selfIntroduce,
//       profileImage,
//       name,
//       age,
//       address,
//       contact,
//     },
//   });
//   // controller
//   return res.status(201).json({ message : "이력서 작성 완료", resume });
// });

// 이력서 목록 조회
// router.get('/resume', async (req, res) => {
//     // controller
//     const orderKey = req.query.orderKey ?? 'resumeId';
//     const orderValue = req.query.orderValue ?? 'desc';

//     if (!['resumeId', 'status'].includes(orderKey)) {
//         return res.status(400).json({
//             success: false,
//             message: 'orderKey 가 올바르지 않습니다.'
//         })
//     }

//     if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
//         return res.status(400).json({
//             success: false,
//             message: 'orderValue 가 올바르지 않습니다.'
//         })
//     }

//     repository
//     const resumes = await prisma.resume.findMany({
//         select: {
//             resumeId: true,
//             userId: true,
//             resumeTitle: true,
//             resumeStatus: true,
//             name:true,
//             userInfos: {
//                 select: {
//                     character: true,
//                 }
//             },
//             createdAt: true,
//         },
//         orderBy: [
//             {
//                 [orderKey]: orderValue.toLowerCase(),
//             }
//         ]
//     })

//     return res.json({ data: resumes });
// })


// 상세조회
// router.get('/resume/:resumeId', authMiddleware, async (req, res) => {
//     // controller
//     const resumeId = req.params.resumeId;
//     if (!resumeId) {
//         return res.status(400).json({
//             success: false,
//             message: 'resumeId는 필수값입니다.'
//         })
//     }

//     repository
//     const resume = await prisma.resume.findFirst({
//         where: {
//             resumeId: Number(resumeId),
//         },
//         select: {
//             resumeId: true,
//             userId: true,
//             resumeTitle: true,
//             resumeStatus: true,
//             name:true,
//             age:true,
           
//             userInfos: {
//                 select: {
//                     gender:true,
//                     character: true,
//                 }
//             },
//             contact:true,
//             address:true,
//             createdAt: true,
//         },
//     })

//     if (!resume) {
//         return res.json({ data: {} });
//     }

//     return res.json({ data: resume });
// })


// 이력서 수정
// router.patch('/resume/:resumeId', authMiddleware, async (req, res) => {
//     // controller
//     const user = req.locals.user;
//     const resumeId = req.params.resumeId;
//     const { resumeTitle,
//         resumeStatus,
//         name,
//         age,
//         address,
//         contact, } = req.body;
    
//     // 에러 메세지 출력
//     if (!resumeId) {
//         return res.status(400).json({
//             success: false,
//             message: 'resumeId 는 필수값입니다',
//         })
//     }
//     if (!resumeTitle) {
//         return res.status(400).json({
//             success: false,
//             message: '이력서 제목은 필수값입니다',
//         })
//     }
//     if (!name) {
//         return res.status(400).json({
//             success: false,
//             message: '이름은 필수값입니다',
//         })
//     }
//     if (!age) {
//         return res.status(400).json({
//             success: false,
//             message: '나이는 필수값입니다',
//         })
//     }
//     if (!address) {
//         return res.status(400).json({
//             success: false,
//             message: '주소는 필수값입니다',
//         })
//     }
//     if (!contact) {
//         return res.status(400).json({
//             success: false,
//             message: '연락처는 필수값입니다',
//         })
//     }
//     // service..?
//     // status 는 있긴한데 6가지 중 해당되지 않을 경우
//     if (!['APPLY', 'DROP', 'PASS', 'INTERVIEW1', 'INTERVIEW2', 'FINAL_PASS'].includes(resumeStatus)) {
//         return res.status(400).json({
//             success: false,
//             message: '올바르지 않은 상태값 입니다.',
//         })
//     }

//     // repository
//     const resume = await prisma.resume.findFirst({
//         where: {
//             resumeId: Number(resumeId),
//         }
//     });

//     // controller
//     if (!resume) {
//         return res.status(400).json({
//             success: false,
//             message: '존재하지 않는 이력서 입니다.',
//         })
//     }

//     if (resume.userId !== user.userId) {
//         return res.status(400).json({
//             success: false,
//             message: '본인 이력서만 수정 가능합니다.',
//         })
//     }

//     // repository
//     // 본인이 작성한 이력서인게 확인 됨
//     await prisma.resume.update({
//         where: {
//             resumeId: Number(resumeId),
//         },
//         data: {
//             resumeTitle,
//             resumeStatus,
//             name,
//             age,
//             address,
//             contact,
//         }
//     })
//     // controller
//     return res.status(201).json({ message: "이력서 수정이 완료 되었습니다." })
// })

// 이력서 삭제
// router.delete('/resume/:resumeId', authMiddleware, async (req, res) => {
//     // controller
//     const user = req.locals.user;
//     const resumeId = req.params.resumeId;

//     if (!resumeId) {
//         return res.status(400).json({
//             success: false,
//             message: 'resumeId 는 필수값입니다',
//         })
//     }

//     // service에서
//     // const resume = await this.resumeRepository.selectOneResume(resumeId)
//     // 로 수정당함
//     // 삭제할 이력서 아이디 찾기
//     const resume = await prisma.resume.findFirst({
//         where: {
//             resumeId: Number(resumeId),
//         }
//     });
//     // 삭제할 이력서 아이디가 없다면
//     if (!resume) {
//         return res.status(400).json({
//             success: false,
//             message: '존재하지 않는 이력서 입니다.',
//         })
//     }
//     // 인증된 사용자와 이력서를 작성한 사용자가 다를 경우
//     if (resume.userId !== user.userId) {
//         return res.status(400).json({
//             success: false,
//             message: '너 누구야',
//         })
//     }

//     // repository
//     await prisma.resume.delete({
//         where: {
//             resumeId: Number(resumeId),
//         },
//     })

//     return res.status(201).json({ message : "이력서가 삭제되었습니다." })
// })

export default router;
