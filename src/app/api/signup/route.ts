import { signup } from "@/lib/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await signup(body);
    return Response.json(result, { status: result.status });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
