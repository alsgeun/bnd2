import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./router/users.router.js";


const app = express();
const PORT = 2024;

app.use(express.json());
app.use(cookieParser());

// 라우터 등록
app.use('/api', [UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
