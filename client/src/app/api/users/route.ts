import axios from "axios";
import { NextRequest } from "next/server";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("x-access-token");

    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const res = await axios.get(process.env.API_URL + "/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Response.json({ users: res.data as PublicUser[] });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}
