import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const USER = process.env.ADMIN_USER || "poweradmin";
const PASS = process.env.ADMIN_PASS || "admin123";
const TOKEN = process.env.ADMIN_TOKEN || "poweradmin-token";
const COOKIE_NAME = "admin_token";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body;
  if (username !== USER || password !== PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  cookies().set({
    name: COOKIE_NAME,
    value: TOKEN,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24
  });

  return NextResponse.json({ ok: true });
}
