import winston from 'winston';  // 윈스턴 가져오기

const logger = winston.createLogger({   // 윈스턴의 로거 만들기
    level : 'info',
    format : winston.format.json(), // 윈스턴이 어떤 방식으로 출력될 것인지 설정
    transports : [                  // 어떤 형태로 포맷된 로거를 출력할것인지
        new winston.transports.Console(),
    ]
})  // 설정 입력

// logger를 사용해서 logging 하는 미들웨어
export default function(req, res, next) {
    const startMomonet = new Date().getTime(); // 시작한 시점 = 현재시간
    
    res.on('finish', () => {        // finish라는 이름을 지어줌
     const duration = new Date().getTime() - startMomonet   // 정상적으로 실행되고 나면 해당 시간 정보를 가져온 다음 시작한 시간을 뺀다.
     logger.info(`method: ${req.method}, URL : ${req.url}, Status: ${res.statusCode},Duration: ${duration}ms`)      // logger의 info level 출력(정보인듯)
    })
    
    next()
}