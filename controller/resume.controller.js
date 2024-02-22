import { ResumeService } from "../service/resume.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

export class ResumeController {
  resumeService = new ResumeService();

  // 이력서 목록조회
  findAllResume = async (req, res) => {
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
        message: "resumeId는 필수값입니다.",
      });
    }

    // params에서 받아온 resumeId 값을 서비스로 보내고, 마지막엔 또 받아온다.
    const resume = await this.resumeService.findOneResumeId(resumeId);
    if (!resume) {
      return res.json({ data: {} });
    }
    // 상세조회된 값
    return res.json({ data: resume });
  };

  // 이력서 작성
  postResume = async (req, res) => {
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

    if (!resumeTitle) {
      return res.status(401).json({ message: "이력서 제목을 입력하세요." });
    }
    if (!name) {
      return res.status(401).json({ message: "이름을 입력하세요." });
    }
    if (!age) {
      return res.status(401).json({ message: "나이를 입력하세요." });
    }
    if (!address) {
      return res.status(401).json({ message: "주소를 입력하세요." });
    }
    if (!contact) {
      return res.status(401).json({ message: "연락처를 입력하세요." });
    }

    // 서비스에게 작성한 이력서 정보를 보냄과 동시에 불러옴
    const resume = await this.resumeService.postingResume({
      userId: +userId,
      resumeTitle,
      selfIntroduce,
      profileImage,
      name,
      age,
      address,
      contact,
    });
    return res.status(201).json({ message: "이력서 작성 완료", resume });
  };

  // 이력서 수정
  updateResume = async (req, res) => {
    const user = req.locals.user;
    const resumeId = req.params.resumeId;
    const { resumeTitle,
        resumeStatus,
        name,
        age,
        address,
        contact, } = req.body;
    
    // 에러 메세지 출력
    if (!resumeId) {
        return res.status(400).json({
            message: 'resumeId 는 필수값입니다',
        })
    }
    if (!resumeTitle) {
        return res.status(400).json({
            message: '이력서 제목은 필수값입니다',
        })
    }
    if (!name) {
        return res.status(400).json({
            message: '이름은 필수값입니다',
        })
    }
    if (!age) {
        return res.status(400).json({
            message: '나이는 필수값입니다',
        })
    }
    if (!address) {
        return res.status(400).json({
            message: '주소는 필수값입니다',
        })
    }
    if (!contact) {
        return res.status(400).json({
            message: '연락처는 필수값입니다',
        })
    }
    // status 는 있긴한데 6가지 중 해당되지 않을 경우
    if (!['APPLY', 'DROP', 'PASS', 'INTERVIEW1', 'INTERVIEW2', 'FINAL_PASS'].includes(resumeStatus)) {
        return res.status(400).json({
            message: '올바르지 않은 상태값 입니다.',
        })
    }
    // 받아온 값을 서비스에게 보냄
    await this.resumeService.updatedResume(
        resumeId,
        {resumeTitle,
        resumeStatus,
        name,
        age,
        address,
        contact,
  }, user)
  return res.status(201).json({ message: "이력서 수정이 완료 되었습니다." })
  };

  // 이력서 삭제
  deleteResume = async (req, res) => {
    const user = req.locals.user;
    const resumeId = req.params.resumeId;

    if (!resumeId) {
        return res.status(400).json({
            message: 'resumeId 는 필수값입니다',
        })
    }
    // 본인이 작성한 이력서 아이디와 유저아이디를 서비스에게 보냄
    await this.resumeService.deleteResumeByResumeId(resumeId, user)

    return res.status(201).json({ message : "이력서가 삭제되었습니다." })
  }
}
