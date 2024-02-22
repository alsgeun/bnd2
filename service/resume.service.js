import { ResumeRepository } from "../repository/resume.repository.js";

export class ResumeService {
    resuemRepository = new ResumeRepository ()

    // 컨트롤러에게서 받아온 sort 값은 딱히 재가공할 필요가 없기 때문에 레퍼지토리로 보내기
    findAllSortedResumes = async (sort) => {
        // sort 값 레퍼지토리로 보내기
        const resumes = await this.resuemRepository.findAllFinishResume(sort)

        // 레퍼지토리를 거쳐 정렬된 값을 컨트롤러로 반환
        return resumes
    }

    
    findOneResumeId = async (resumeId) => {
        // repository에 값을 불러옴과 동시에 보낸다.
        const resume = await this.resuemRepository.selectOneResume(resumeId)
        
        // 레퍼지토리를 거쳐서 찾은 이력서 목록을 컨트롤러로 넘겨줌
        return resume
    }
}
