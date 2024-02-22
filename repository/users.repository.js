import { prisma } from "../src/utils/prisma/index.js";
import bcrypt from "bcrypt";

export class UserRepository {
    createUser = async (email, hashedPassword) => {
        const isExistUser = await prisma.users.findFirst({
            where : { email }
        })
        if (isExistUser) {  // 동일한 이메일로 가입한 사용자가 있을 경우
            throw Error('이미 존재하는 이메일 입니다.');
        }
        const user = await prisma.users.create({
            data : { 
                email,
                password : hashedPassword,
            }
        });

        return user;
    }
    createUserInfo = async (userId, name, age, gender, character, profileImage) => {
        const userInfo = await prisma.userInfos.create({
            data : {
                userId,
                name,
                age,
                gender,
                profileImage,
                character
            }
        });

        return userInfo;
    }
    // // users 생성
    // createUser = async (email, hashedPassword) => {
    //     // 이메일 중복 체크
    //     const isExistUser = await prisma.users.findFirst({  // 프리즈마 클라이언트로 users 테이블에서 찾아내고 변수에 저장
    //         where : { email }
    //     })
    //     if (isExistUser) {  // 동일한 이메일로 가입한 사용자가 있을 경우
    //         throw new Error ('이미 존재하는 이메일 입니다.')
    //         // return res.status(409).json({ message : '이미 존재하는 이메일 입니다.'});
    //     }
    //     // DB에 저장
    //     const user = await prisma.users.create({    // users 모델에 생성(저장)
    //         data : { 
    //             email,
    //             password : hashedPassword,
    //          }              // email과 password를 이용해서 생성, 비밀번호는 hashedPassword(암호화된 비밀번호 형태)로 저장
    //     })
    //     if (!user) {
    //         throw new Error ('사용자 생성에 실패하였습니다.')
    //     }
    //     return user
    // }
    // // userInfo 생성
    // createUserInfo = async (name, age, gender,character, profileImage) => {
    //     const users = await prisma.users.findFirst({
    //         where : userId
    //     })
    //     const userInfo = await prisma.userInfos.create({
    //         data : {
    //             userId : users.userId,
    //             name,
    //             age,
    //             gender,
    //             profileImage,
    //             character
    //         }
    //     })
    //     return userInfo
    // }

    // 로그인
    findUserId = async (email) => {
        const user = await prisma.users.findFirst({ where : {email}})
        return user
    }

    // 정보조회
    myInfo = async (userId) => {
        const user = await prisma.users.findFirst({
            where : { userId : +userId },   // 우리가 갖고 있는 userId와 전달받은 userId가 일치 하는지 찾아볼거다.
            select : {                      // 조회할 users의 컬럼들 지정
                userId : true,
                email : true,
                createdAt : true,
                updatedAt : true,
                userinfos : {               // 중첩셀렉문 사용 가능. user와 userinfos 테이블은 관계(1:1)를 맺었기 때문에 불러오기 가능
                    select : {
                        name : true,
                        age : true,
                        gender : true,
                        character : true,
                        profileImage : true,
                    }
                }
            }
        })
        return user
    }
}