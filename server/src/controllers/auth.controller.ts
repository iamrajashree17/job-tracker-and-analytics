// create signup handler calls service and returns 201
import { login, logout, refreshToken, signup } from "../services/auth.service";

export function signupHandler(req: any, res: any) {
  const result = signup(req.body);
  res.status(result.status).json(result);
}

export function loginHandler(req: any, res: any) {
  const result = login(req.body);
  res.status(result.status).json(result);
}

export function refreshHandler(req: any, res: any) {
  const { token } = req.body;
  const result = refreshToken(token);
  res.status(result.status).json(result);
}

export function logoutHandler(req: any, res: any) {
  const { token } = req.body;
  const result = logout(token);
  res.status(result.status).json(result);
}
