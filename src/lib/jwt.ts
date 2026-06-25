import jwt from "jsonwebtoken";

export type JwtPayload = { id: string; email: string };

export function generateAccessToken(user: { id: string; email: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as any },
  );
}

export function generateRefreshToken(user: { id: string; email: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key",
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any },
  );
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key") as JwtPayload;
  } catch {
    return null;
  }
}
