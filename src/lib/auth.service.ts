import crypto from "crypto";
import bcrypt from "bcryptjs";
import { readUsers, writeUsers, readTokens, writeTokens } from "./fileDb";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./jwt";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export function signup(body: { name: string; email: string; password: string }) {
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return { status: 400, message: "Name, email, and password are required" };
  }

  const users = readUsers() as User[];
  if (users.find((u) => u.email === email)) {
    return { status: 400, message: "Email already exists" };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, newUser]);
  return { status: 201, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
}

export function login(body: { email: string; password: string }) {
  const { email, password } = body;
  if (!email || !password) {
    return { status: 400, message: "Email and password are required" };
  }

  const users = readUsers() as User[];
  const user = users.find((u) => u.email === email);
  if (!user) return { status: 404, message: "User not found" };

  if (!bcrypt.compareSync(password, user.password)) {
    return { status: 401, message: "Invalid password" };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  writeTokens([...readTokens(), refreshToken]);

  return {
    status: 200,
    user: { id: user.id, name: user.name, email: user.email, accessToken, refreshToken },
  };
}

export function refresh(token: string) {
  const tokens = readTokens();
  if (!tokens.includes(token)) {
    return { status: 403, message: "Invalid refresh token" };
  }

  const payload = verifyRefreshToken(token);
  if (!payload) return { status: 403, message: "Invalid refresh token" };

  const users = readUsers() as User[];
  const user = users.find((u) => u.id === payload.id);
  if (!user) return { status: 404, message: "User not found" };

  const newRefreshToken = generateRefreshToken(user);
  writeTokens([...tokens.filter((t) => t !== token), newRefreshToken]);

  return {
    status: 200,
    accessToken: generateAccessToken(user),
    refreshToken: newRefreshToken,
  };
}

export function logout(token: string) {
  writeTokens(readTokens().filter((t) => t !== token));
  return { status: 200, message: "Logged out successfully" };
}
