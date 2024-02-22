import { ResumeService } from "../service/resume.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

export class ResumeController {
  resumeService = new ResumeService();

  // 이력서 목록조회
  findAllResume = async (req,res) => {
    // 기존 resume router에 있던 받아오는 코드들과 즉각 에러 반환
    const orderKey = req.query.orderKey ?? "resumeId";
    const orderValue = req.query.orderValue ?? "desc";

    if (!["resumeId", "status"].includes(orderKey)) {
      return res.status(400).json({
        success: false,
        message: "orderKey 가 올바르지 않습니다.",
      });
    }

    if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "orderValue 가 올바르지 않습니다.",
      });
    }
    // 서비스에게 정렬기준 데이터 보내기
    const resumes = await this.resumeService.findAllSortedResumes({
      orderKey,
      orderValue: orderValue.toLowerCase(),
    });
    return res.status(201).json({ data: resumes });
  };

  // 이력서 상세조회
  detailResume = async (req, res) => {
    const resumeId = req.params.resumeId;
    if (!resumeId) {
        return res.status(400).json({
            success: false,
            message: 'resumeId는 필수값입니다.'
        })
    }

    // params에서 받아온 resumeId 값을 서비스로 보내고, 마지막엔 또 받아온다.
    const resume = await this.resumeService.findOneResumeId(resumeId)
    if (!resume) {
        return res.json({ data: {} });
    }

    return res.json({ data: resume });
  }

  // 이력서 작성
//   postResume = async (req, res) => {

//   }
}
