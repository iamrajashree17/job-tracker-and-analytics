import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./jwt";

export async function loginOrCreateGoogleUser(data: { googleId: string; email: string; name: string }) {
  const { googleId, email, name } = data;

  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      user = await prisma.user.update({ where: { id: existing.id }, data: { googleId } });
    } else {
      user = await prisma.user.create({ data: { name, email, googleId } });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    status: 200 as const,
    user: { id: user.id, name: user.name, email: user.email, accessToken, refreshToken },
  };
}

export async function signup(body: { name: string; email: string; password: string }) {
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return { status: 400, message: "Name, email, and password are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { status: 400, message: "Email already exists" };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    },
  });

  return { status: 201, user: { id: user.id, name: user.name, email: user.email } };
}

export async function login(body: { email: string; password: string }) {
  const { email, password } = body;
  if (!email || !password) {
    return { status: 400, message: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: 404, message: "User not found" };

  if (!user.password) {
    return { status: 400, message: "This account uses Google Sign-In. Please sign in with Google." };
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return { status: 401, message: "Invalid password" };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    status: 200,
    user: { id: user.id, name: user.name, email: user.email, accessToken, refreshToken },
  };
}

export async function refresh(token: string) {
  const payload = verifyRefreshToken(token);
  if (!payload) return { status: 403, message: "Invalid refresh token" };

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return { status: 404, message: "User not found" };

  return {
    status: 200,
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

export function logout() {
  return { status: 200, message: "Logged out successfully" };
}
