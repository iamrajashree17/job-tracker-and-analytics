import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { listUsers } from "@/lib/user.service";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-access-token");
  if (!token || !verifyAccessToken(token)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();
  return Response.json({ users });
}
