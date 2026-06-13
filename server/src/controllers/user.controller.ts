import { listUsers } from "../services/user.service";

export function userHandler(req: any, res: any) {
  const users = listUsers();
  res.status(200).json(users);
}
