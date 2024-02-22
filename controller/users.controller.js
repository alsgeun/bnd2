import { UserService } from "../service/users.service.js"

export class UserController {
    userService = new UserService()
    // 회원가입 api
    signUp = async (req, res, next) => {
        try {
            // req.body로 회원가입에 필요한 정보들만 받아옴
            const { email, password, confirmPassword, name, age, gender, character, profileImage } = req.body;

            // userService에 signUp이라는 메서드를 호출하고 정보들을 넘겨줌
            const userInfo = await this.userService.signUp(email, password, name, age, gender, character, profileImage);
            
            // 컨트롤러에게서 넘겨받은 비밀번호 확인 // res를 활용해서 직접적으로 표시하기 위해 에러를 컨트롤러에서 처리
            if (confirmPassword !== password) {     
                return res.status(401).json({ message : '비밀번호가 일치 하지 않습니다.' });
            }
            if (password.length < 6) {  // 비밀번호 6글자 이하시 에러 메세지 전송
                return res.status(401).json({ message : '비밀번호를 6글자 이상 입력 해주세요.' });
            }

            // 한바퀴 돌아서 클라이언트에게 최종적으로 반환해주는 결과물들
            return res.status(201).json({
                message : '회원가입이 완료되었습니다.',
                userInfo
            });
        } catch (err) {
            next(err)
        }}
 
    // 로그인 api
    signIn = async (req, res) => {
        const { email, password } = req.body
        const token = await this.userService.userSignIn(email,password)
        res.cookie('accessToken', `Bearer ${token.accessToken}`)
        res.cookie('refreshToken', `Bearer ${token.refreshToken}`)
        return res.status(200).json({ message : '로그인에 성공하였습니다.' })
    }

    // 사용자 정보 조회
    infoUser = async (req, res) => {
        const { userId } = req.locals.user
        const user = await this.userService.findUserId(userId)
        return res.status(200).json({ data : user });
    }
} // 기본에 충실하자