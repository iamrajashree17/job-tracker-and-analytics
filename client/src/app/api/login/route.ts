import axios from "axios";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(request: Request) {
  try {
    const values = await request.json();
    const res = await axios.post(
      process.env.API_URL + "/api/auth/login",
      values,
    );
    const { user } = res.data;
    const response = NextResponse.json(res.data, { status: res.status });

    response.cookies.set("token", user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 20, // 20 seconds, matches JWT_EXPIRES_IN
      path: "/",
    });
    response.cookies.set("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days, matches JWT_REFRESH_EXPIRES_IN
      path: "/",
    });
    return response;
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}
