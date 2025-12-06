import { NextResponse } from "next/server";
import { context, propagation } from "@opentelemetry/api";

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function POST() {
  const headers: Record<string, string> = {};
  propagation.inject(context.active(), headers);

  const res = await fetch(API_URL + "/session/create", {
    method: "POST",
    headers,
  });
  const data = await res.json();
  return NextResponse.json(data);
}
