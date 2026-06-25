import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { getJob, deleteJob, updateJob } from "@/lib/job.service";

function getUser(request: NextRequest) {
  const token = request.headers.get("x-access-token");
  if (!token) return null;
  return verifyAccessToken(token);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const job = await getJob(id);
    return Response.json(job);
  } catch {
    return Response.json({ message: "Job not found" }, { status: 404 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteJob(id);
    return Response.json({ message: "Job deleted successfully" });
  } catch {
    return Response.json({ message: "Job not found" }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUser(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  try {
    await updateJob(id, body);
    return Response.json({ message: "Job updated successfully" });
  } catch {
    return Response.json({ message: "Job not found" }, { status: 404 });
  }
}
