import { NextResponse } from "next/server";
import { context, propagation } from "@opentelemetry/api";

const API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const headers: Record<string, string> = {};
  propagation.inject(context.active(), headers);

  await fetch(API_URL + "/session/" + sessionId, {
    method: "DELETE",
    headers,
  });
  return NextResponse.json({ success: true });
}
