import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  (req as any).user = payload;
  next();
}
