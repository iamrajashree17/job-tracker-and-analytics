import { User } from "../types/auth.types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateAccessToken(user: any): string {
  const secretKey = process.env.JWT_SECRET || "your_secret_key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "20s";
  return jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: expiresIn as any,
  });
}

export function generateRefreshToken(user: any): string {
  const secretKey = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
  return jwt.sign({ id: user.id, email: user.email }, secretKey, {
    expiresIn: expiresIn as any,
  });
}

export function verifyAccessToken(token: string): any {
  const secretKey = process.env.JWT_SECRET || "your_secret_key";
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): any {
  const secretKey = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}
