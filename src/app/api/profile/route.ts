import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { getProfile, updateProfile } from "@/lib/profile.service";

function getUser(request: NextRequest) {
  const token = request.headers.get("x-access-token");
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function GET(request: NextRequest) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ profile: await getProfile() });
}

export async function PUT(request: NextRequest) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const profile = await updateProfile(body);
  return Response.json({ profile });
}
