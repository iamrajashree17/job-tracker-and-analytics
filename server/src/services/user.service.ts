import { readUsers } from "../utils/fileDb.utils";

export function listUsers() {
  const users = readUsers();
  return users.map((user: { id: any; name: any; email: any; createdAt: any }) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt ?? null,
  }));
}
