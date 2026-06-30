import { NextResponse } from "next/server";
import { login } from "@/lib/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await login(body);
    const response = NextResponse.json(result, { status: result.status });

    if (result.status === 200 && result.user) {
      response.cookies.set("token", result.user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/",
      });
      response.cookies.set("refreshToken", result.user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
