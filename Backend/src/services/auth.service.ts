import prisma from "../config/db.js";
import { hashPashword, comparePassword } from "../utils/hash.js";
import { Role } from "@prisma/client";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import crypto from "crypto"

interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    role: Role;
}

interface LoginUserPayload {
    email: string;
    password: string;
}

export const registerUser = async (userData: RegisterUserPayload) => {
    const { name, email, password, role } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPashword(password);
    const user = await prisma.user.create({
        data: {
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role
        }
    })

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}


export const loginUser = async (userData: LoginUserPayload) => {
    const { email, password } = userData;

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
        throw new Error("Invalid email or password")
    }

    //verify password
    const isValidPassword = comparePassword(password, user.password);
    if (!isValidPassword) {
        throw new Error("Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    await prisma.refreshToken.create({
        data: {
            tokenHash,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    })

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
};
