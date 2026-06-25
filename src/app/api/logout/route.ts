import { NextResponse } from "next/server";
import { logout } from "@/lib/auth.service";

export async function POST() {
  logout();

  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  return response;
}
