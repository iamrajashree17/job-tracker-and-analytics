import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      await axios.post(process.env.API_URL + "/api/auth/logout", {
        token: refreshToken,
      });
    } catch {
      // proceed to clear cookies even if Express call fails
    }
  }

  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  return response;
}
