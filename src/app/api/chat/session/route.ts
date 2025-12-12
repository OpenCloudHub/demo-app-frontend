/**
 * @fileoverview API route for creating new chat sessions.
 *
 * This route creates new session identifiers on the backend,
 * which are used to maintain conversation context in the RAG system.
 */

import { NextResponse } from "next/server";
import { context, propagation } from "@opentelemetry/api";

/** Backend API URL - defaults to localhost for development */
const API_URL = process.env.API_URL || "http://localhost:8000";

/**
 * POST handler for creating a new chat session.
 *
 * @returns JSON response containing the new session_id
 */
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
