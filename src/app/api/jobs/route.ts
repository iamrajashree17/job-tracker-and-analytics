import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { listJobs, addJob } from "@/lib/job.service";

function getUser(request: NextRequest) {
  const token = request.headers.get("x-access-token");
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function GET(request: NextRequest) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const fromDate = searchParams.get("fromDate") ?? undefined;
  const toDate = searchParams.get("toDate") ?? undefined;

  const jobs = listJobs(status, fromDate, toDate);
  return Response.json({ jobs });
}

export async function POST(request: NextRequest) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  addJob(body);
  return Response.json({ message: "Job added successfully" }, { status: 201 });
}
