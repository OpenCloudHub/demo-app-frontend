/**
 * @fileoverview API route for deleting chat sessions.
 *
 * This route handles session deletion, cleaning up conversation
 * history from the backend RAG service.
 */

import { NextResponse } from "next/server";
import { context, propagation } from "@opentelemetry/api";

/** Backend API URL - defaults to localhost for development */
const API_URL = process.env.API_URL || "http://localhost:8000";

/**
 * DELETE handler for removing a chat session.
 *
 * @param request - The incoming request object
 * @param params - Route parameters containing the sessionId
 * @returns JSON response indicating success
 */
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
