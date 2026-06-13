import { readTokens, readUsers, writeTokens } from "../utils/fileDb.utils";
import crypto from "crypto";
import { writeUsers } from "../utils/fileDb.utils";
import { User } from "../types/auth.types";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils";

export function signup(user: User) {
  const { name, email, password } = user;
  if (!name || !email || !password) {
    return { status: 400, message: "Name, email, and password are required" };
  }

  let users = readUsers();
  const existingUser = users.find(
    (user: { email: any }) => user.email === email,
  );
  if (existingUser) {
    return { status: 400, message: "Email already exists" };
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  // return the created user without the password
  return {
    status: 201,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  };
}

export function login(user: { email: string; password: string }) {
  const { email, password } = user;

  if (!email || !password) {
    return { status: 400, message: "Email and password are required" };
  }

  const users = readUsers();
  const existingUser = users.find(
    (user: { email: any }) => user.email === email,
  );

  if (!existingUser) {
    return { status: 404, message: "User not found" };
  }

  const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordValid) {
    return { status: 401, message: "Invalid password" };
  }
  const accessToken = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  writeTokens([...readTokens(), refreshToken]);

  return {
    status: 200,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      accessToken,
      refreshToken,
    },
  };
}

export function refreshToken(token: string) {
  const tokens = readTokens();
  if (!tokens.includes(token)) {
    return { status: 403, message: "Invalid refresh token" };
  }
  const payload = verifyRefreshToken(token);

  if (!payload) {
    return { status: 403, message: "Invalid refresh token" };
  }
  const users = readUsers();
  const user = users.find((user) => user.id === payload.id);

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  const newToken = generateRefreshToken(user!);
  writeTokens([...tokens.filter((t) => t !== token), newToken]);

  const newAccessToken = generateAccessToken(user);
  return { status: 200, accessToken: newAccessToken, refreshToken: newToken };
}

export function logout(token: string) {
  const tokens = readTokens();
  const updatedTokens = tokens.filter((t) => t !== token);
  writeTokens(updatedTokens);
  return { status: 200, message: "Logged out successfully" };
}
