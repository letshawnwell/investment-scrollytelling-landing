import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/auth";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "cms.json");

async function readContent() {
  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export async function GET() {
  const content = await readContent();
  if (!content) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  if (!requireAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await fs.writeFile(dataPath, JSON.stringify(body, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
