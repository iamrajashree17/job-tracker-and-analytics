import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const res = await axios.post(process.env.API_URL + "/api/auth/refresh", {
      token: refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = res.data;
    const response = NextResponse.json(
      { message: "Token refreshed" },
      { status: 200 },
    );

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    const status =
      (err as { response?: { status?: number } }).response?.status ?? 500;
    const data = (err as { response?: { data?: unknown } }).response?.data ?? {
      error: "Something went wrong",
    };
    return Response.json(data, { status });
  }
}
