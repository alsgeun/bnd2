import express from "express";
import { prisma } from "../src/utils/prisma/index.js";  // 프리즈마 클라이언트 소환
import bcrypt from "bcrypt";    // 비크립트 소환!

const router = express.Router();    // 라우터 소환

// 회원가입 api
router.post('/sign-up', async(req, res, next) => {
    const { email, password, confirmPassword, name, age, gender,character, profileImage, } = req.body;  // 회원가입시 이런걸 적어라 하고 body에 담아 서버에게 요청
    
    // 동일한 e메일 사용자 있는지 확인
    const isExistUser = await prisma.users.findFirst({  // 프리즈마 클라이언트로 users 테이블에서 찾아내고 변수에 저장
        where : { email }
    })
    
    if (confirmPassword !== password) {     // 비밀번호 재확인 실패할 경우
        return res.status(409).json({ message : '비밀번호가 일치 하지 않습니다.'});
    }
    if (isExistUser) {  // 동일한 이메일로 가입한 사용자가 있을 경우
        return res.status(409).json({ message : '이미 존재하는 이메일 입니다.'});
        }
    if (password.length < 6) {  // 비밀번호 6글자 이하시 에러 메세지 전송
        return res.status(409).json({ message : '비밀번호를 6글자 이상 입력 해주세요.'});
    }
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash (password, 10); // 비크립트를 통해 다져서 못알아보게 한다.(.hash) 뭐를? 비밀번호를(password,) 몇번? 10번.(10)
    // 사용자 생성
    const user = await prisma.users.create({    // users 모델에서 생성
        data : { 
            email,
            password : hashedPassword,
         }              // email과 password를 이용해서 생성, 비밀번호는 hashedPassword(암호화된 비밀번호 형태)로 저장
    })
    // 사용자 정보 생성
    const userInfo = await prisma.userInfos.create({
        data : {
            userId : user.userId,   // userId : 생성된 사용자(user)의 userId값 그대로 복사
            name,
            age,
            gender,
            profileImage,
            character    // userInfo 모델에 있던 정보들
        }
    })
    return res.status(201).json({
        message : '회원가입이 완료되었습니다.',
        userId : user.userId,
        email : user.email,
        name : userInfo.name,       // userInfo 라는 변수 안에서 name 값을 가져온다. name 값의 출처는 userInfos
        age : userInfo.age,         
        gender : userInfo.gender,
        character : userInfo.character,
        profileImage : userInfo.profileImage
    });
});

export default router;  // 라우터 수출