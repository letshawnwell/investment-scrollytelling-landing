import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAuth } from "../../../lib/auth";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  if (!requireAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  await fs.mkdir(uploadDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const target = path.join(uploadDir, safeName);
  await fs.writeFile(target, buffer);
  return NextResponse.json({ ok: true, path: `/uploads/${safeName}` });
}
