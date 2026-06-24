import axios from "axios";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/jobs/[id]">) {
  try {
    const token = req.headers.get("x-access-token");
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const res = await axios.get(process.env.API_URL + `/api/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Response.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/jobs/[id]">) {
  try {
    const token = req.headers.get("x-access-token");
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const res = await axios.delete(process.env.API_URL + `/api/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Response.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/jobs/[id]">) {
  try {
    const token = req.headers.get("x-access-token");
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    const body = await req.json();
    const res = await axios.patch(process.env.API_URL + `/api/jobs/${id}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Response.json(res.data, { status: res.status });
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { error: "Something went wrong" };
    return Response.json(data, { status });
  }
}
