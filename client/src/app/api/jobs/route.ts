import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("x-access-token");
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const url = new URL(process.env.API_URL + "/api/jobs");
    if (status) url.searchParams.set("status", status);
    if (fromDate) url.searchParams.set("fromDate", fromDate);
    if (toDate) url.searchParams.set("toDate", toDate);

    const res = await axios.get(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Response.json({ jobs: res.data });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("x-access-token");
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const res = await axios.post(process.env.API_URL + "/api/jobs", body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Response.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}
