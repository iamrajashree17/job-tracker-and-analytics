import { NextRequest, NextResponse } from "next/server";
import { refresh } from "@/lib/auth.service";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  const result = await refresh(refreshToken);

  if (result.status !== 200) {
    return Response.json(result, { status: result.status });
  }

  const response = NextResponse.json(
    { accessToken: result.accessToken, refreshToken: result.refreshToken },
    { status: 200 },
  );

  response.cookies.set("token", result.accessToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 15,
    path: "/",
  });
  response.cookies.set("refreshToken", result.refreshToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
