import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { requireAuth } from "../../../../lib/auth";

const messagesPath = path.join(process.cwd(), "data", "messages.json");

export async function GET() {
  if (!requireAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const raw = await fs.readFile(messagesPath, "utf-8");
    const data = JSON.parse(raw) as any[];
    const header = ["id", "name", "email", "topic", "message", "createdAt"];
    const rows = data.map((m) =>
      header
        .map((key) => {
          const val = (m as any)[key] ?? "";
          if (typeof val === "string" && val.includes(",")) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=messages.csv"
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
