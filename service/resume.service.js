import { ResumeRepository } from "../repository/resume.repository.js";

export class ResumeService {
    resumeRepository = new ResumeRepository ()

    // 컨트롤러에게서 받아온 sort 값은 딱히 재가공할 필요가 없기 때문에 레퍼지토리로 보내기
    findAllSortedResumes = async (sort) => {
        // sort 값 레퍼지토리로 보내기
        const resumes = await this.resumeRepository.findAllFinishResume(sort)

        // 레퍼지토리를 거쳐 정렬된 값을 컨트롤러로 반환
        return resumes
    }

    // 상세조회
    findOneResumeId = async (resumeId) => {
        // repository에 값을 불러옴과 동시에 보낸다.
        const resume = await this.resumeRepository.selectOneResume(resumeId)
        
        // 레퍼지토리를 거쳐서 찾은 이력서 목록을 컨트롤러로 넘겨줌
        return resume
    }

    // 작성
    postingResume = async (
        // 최종적으로 이력서에 저장될 정보들을 인자값으로 받음
        userId,
        resumeTitle,
        selfIntroduce,
        profileImage,
        name,
        age,
        address,
        contact,) => {
        // repository에 값을 불러옴과 동시에 보낸다.
        const resume =  await this.resumeRepository.finishPostingResume(
            userId,
            resumeTitle,
            selfIntroduce,
            profileImage,
            name,
            age,
            address,
            contact
            )
        // 작성한 다음 레퍼지토리를 거쳐서 저장된 이력서 내용을 컨트롤러로 전해줌(옵션)
        return resume
    }   
    
    // 수정
    updatedResume = async (resumeId, data, byUser) => {
        // 이력서 아이디는 따로 보냄
        const resume = await this.resumeRepository.selectOneResume(resumeId)
 
        if (!resume) {
            throw {
                code : 401,
                message: '존재하지 않는 이력서 입니다.',
            }
        }
    
        if (resume.userId !== byUser.userId) {
            throw {
                code : 401,
                message: '본인 이력서만 수정 가능합니다.',
            }
        }
        
        // 이력서 아이디와 수정할 데이터들을 레퍼지토리로 보냄
        await this.resumeRepository.changedResume(resumeId, data)
    }

    // 삭제
    deleteResumeByResumeId = async (resumeId, byUser) => {
        const resume = await this.resumeRepository.selectOneResume(resumeId)

        if (!resume) {
            throw {
                code : 400,
                message: '존재하지 않는 이력서 입니다.',
            }
        }
        // 인증된 사용자와 이력서를 작성한 사용자가 다를 경우
        if (resume.userId !== byUser.userId) {
            throw {
                code : 400,
                message: '너 누구야',
            }
        }
    
        await this.resumeRepository.byebyeResume(resumeId)
    }
}
