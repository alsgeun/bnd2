import { UserRepository } from "../repository/users.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  userRepository = new UserRepository();

  // 회원가입 api
  signUp = async (
    email,
    password,
    name,
    age,
    gender,
    character,
    profileImage,
  ) => {
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 암호화
    // 이메일과 암호화 시킨 비밀번호를 userRepository로 보냄
    const user = await this.userRepository.createUser(email, hashedPassword);
    // 나머지 정보들도 user라는 이름으로 userRepository로 보냄
    const userInfo = await this.userRepository.createUserInfo(
      user.userId,
      name,
      age,
      gender,
      character,
      profileImage,
    );

    // 한바퀴 돌아서 컨트롤러에게 향할 땐 userInfo의 데이터만 컨트롤러로 보냄 (user의 정보는 db에 저장)
    return userInfo;
  };
  // signUp = async (email, password, confirmPassword, name, age, gender,character, profileImage) => {
  //     // 비밀번호 틀리대
  //     if (confirmPassword !== password) {     // 비밀번호 재확인 실패할 경우
  //         return res.status(409).json({ message : '비밀번호가 일치 하지 않습니다.'});
  //     }
  //     if (password.length < 6) {  // 비밀번호 6글자 이하시 에러 메세지 전송
  //         return res.status(409).json({ message : '비밀번호를 6글자 이상 입력 해주세요.'});
  //     }
  //     // 비밀번호 암호화
  //     const hashedPassword = await bcrypt.hash (password, 10);
  //     // 암호화 한 비밀번호로 바꿔서 이메일과 함께 레퍼지토리에게 넘겨줌
  //     const user = await this.userRepository.createUser(email, hashedPassword)
  //     if (!user) {
  //         throw new Error('서버 내부에서 오류가 발생했습니다.')
  //     }
  //     // 나머지 정보들은 userInfo 라는 프리즈마에 남아야 하기 때문에 나눠서 레퍼지토리에게 넘겨줌
  //     const userInfo = await this.userRepository.createUserInfo(name, age, gender, character, profileImage)
  //     return userInfo
  // }

  // 로그인 api
  userSignIn = async (email, password) => {
    const user = await this.userRepository.findUserId(email);
    if (!(await bcrypt.compare(password, user.password)) || !user)
      throw {
        code: 400,
        message: "이메일 또는 비밀번호가 일치하지 않습니다.",
      };
    const accessToken = jwt.sign(
      { userId: user.userId }, // 안에 내용물은 userId인데 userId 출처는 바로 위에서 만든 user라는 변수에 담긴 userId를 쓸 것이다.
      process.env.ACCESS_TOKEN_SECRET_KEY, // 노출되면 안되는 비밀키
      { expiresIn: "12h" }, // 유효기간 12시간
    );
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "7d" },
    );
    return {
      accessToken,
      refreshToken,
    };
  };

  // 사용자 정보 조회
  findUserId = async (userId) => {
   const user = await this.userRepository.myInfo(userId)
   return user
  }
}
