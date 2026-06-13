import axios from "axios";

export async function POST(request: Request) {
  const values = await request.json();
  const res = await axios.post(
    process.env.API_URL + "/api/auth/signup",
    values,
  );
  return Response.json(res.data, { status: res.status });
}
