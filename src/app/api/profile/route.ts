import { NextRequest } from "next/server";
import { verifyAccessToken, JwtPayload } from "@/lib/jwt";
import { getProfile, updateProfile } from "@/lib/profile.service";

function getUser(request: NextRequest): JwtPayload | null {
  const token = request.headers.get("x-access-token");
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function GET(request: NextRequest) {
  const user = getUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ profile: await getProfile(user.id) });
}

export async function PUT(request: NextRequest) {
  const user = getUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const profile = await updateProfile(user.id, body);
  return Response.json({ profile });
}
