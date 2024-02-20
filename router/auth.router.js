import express from "express";
import { prisma } from "../src/utils/prisma/index.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/token', async (req, res) => {
    const { refreshToken } = req.body;

    const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!token.userId) {
        return res.status(401).json({ message : "토큰 속 유저 아이디가 없습니다."})
    }

    const user = await prisma.users.findFirst({
        where: {
            userId: token.userId,
        }
    })

    if (!user) {
        return res.status(401).end();
    }

    // freshToken 유효함 -> accessToken, refreshToken 재발급
    const newAccessToken = jwt.sign({ userId: user.userId }, 'resume@#', { expiresIn: '12h' });
    const newRefreshToken = jwt.sign({ userId: user.userId }, 'resume&%*', { expiresIn: '7d' });

    return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    })
})
export default router