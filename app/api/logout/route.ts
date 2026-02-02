import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

export async function POST() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0
  });
  return NextResponse.json({ ok: true });
}
