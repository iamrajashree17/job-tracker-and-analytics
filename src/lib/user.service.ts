import { readUsers } from "./fileDb";

export function listUsers() {
  return readUsers().map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt ?? null,
  }));
}
