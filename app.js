import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./router/users.router.js";
import logMiddleware from "./middlewares/log.middleware.js";
import errorHandlingMiddleware from "./middlewares/error.handling.middleware.js";

const app = express();
const PORT = 2024;

app.use(logMiddleware);
app.use(express.json());
app.use(cookieParser());

// 라우터 등록
app.use('/api', [UsersRouter]);

app. use(errorHandlingMiddleware);  // 위에 있던 에러들을 종합해서 처리해야 되기 때문에 에러처리 미들웨어는 최하단에 위치한다.

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
