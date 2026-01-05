import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface AccessTokenGenerator {
    (userId: string, role: Role): string;
}

//Generate Access Token
export const generateAccessToken: AccessTokenGenerator = (userId, role) => {
    return jwt.sign({ userId, role }, JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

//Generate refresh Token
export const generateRefreshToken: AccessTokenGenerator = (userId, role) => {
    return jwt.sign({ userId, role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

//Verify Access Token
export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_ACCESS_SECRET);
}

//Verify Refresh Token
export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}