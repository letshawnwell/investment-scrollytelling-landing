import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAuth } from "../../../lib/auth";

const messagesPath = path.join(process.cwd(), "data", "messages.json");

async function readMessages() {
  try {
    const raw = await fs.readFile(messagesPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveMessages(data: any[]) {
  await fs.writeFile(messagesPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  if (!requireAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const msgs = await readMessages();
  return NextResponse.json(msgs);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { name, email, topic = "", message = "" } = body;
  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const msgs = await readMessages();
  msgs.push({
    id: Date.now(),
    name,
    email,
    topic,
    message,
    createdAt: new Date().toISOString()
  });
  await saveMessages(msgs);
  return NextResponse.json({ ok: true });
}
