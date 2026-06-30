import { NextRequest, NextResponse } from "next/server";
import { loginOrCreateGoogleUser } from "@/lib/auth.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=oauth_cancelled", baseUrl));
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", baseUrl));
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", baseUrl));
    }

    const googleUser = await userRes.json();

    const result = await loginOrCreateGoogleUser({
      googleId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
    });

    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.redirect(new URL("/jobs", baseUrl));
    response.cookies.set("token", result.user.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });
    response.cookies.set("refreshToken", result.user.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", baseUrl));
  }
}
