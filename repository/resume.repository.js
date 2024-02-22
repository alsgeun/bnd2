import { prisma } from "../src/utils/prisma/index.js";

export class ResumeRepository {
    // 넘겨받은 sort 값을 기준으로 정렬된 데이터를 서비스에게 넘겨줌
    findAllFinishResume = async (sort) => {
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
                [sort.orderKey]: sort.orderValue,
            }
        ]
    })
    return resumes
}

    // 상세조회
    // 넘겨받은 resumeId를 기준으로 db에서 해당 이력서들 찾기
    selectOneResume = async (resumeId) => {
        const resume = await prisma.resume.findFirst({
            where: {
                resumeId: +resumeId,
            },
            select: {
                resumeId: true,
                userId: true,
                resumeTitle: true,
                resumeStatus: true,
                name:true,
                age:true,
               
                userInfos: {
                    select: {
                        gender:true,
                        character: true,
                    }
                },
                contact:true,
                address:true,
                createdAt: true,
            },
        })
        return resume
}
// 작성
finishPostingResume = async (data) => {
    const resume = await prisma.resume.create({
        // 넘겨 받은 data 값 그대로 저장(생성)할 것이기 때문에
        data,
        })
      return resume
}

// 수정
changedResume = async (resumeId, data) => {
    await prisma.resume.update({
        where: {
            resumeId: +resumeId,
        },
        data,
    })
    }

// 삭제
byebyeResume = async (resumeId) => {
    await prisma.resume.delete({
        where: {
            resumeId: +resumeId,
        },
    })
}
}
