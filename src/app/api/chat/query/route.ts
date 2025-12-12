/**
 * @fileoverview API route for streaming chat queries to the backend.
 *
 * This route proxies chat queries to the GenAI backend service,
 * injecting OpenTelemetry trace context (traceparent header) for
 * distributed tracing across services.
 */

import { NextRequest } from "next/server";
import { context, propagation } from "@opentelemetry/api";
import { logger } from "@/lib/logger";

/** Backend API URL - defaults to localhost for development */
const API_URL = process.env.API_URL || "http://localhost:8000";

/**
 * POST handler for chat query requests.
 *
 * Forwards the query to the backend RAG service and streams
 * the response back to the client using Server-Sent Events.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  logger.info("Query request received", {
    session_id: body.session_id,
    question_length: body.question?.length,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  propagation.inject(context.active(), headers);

  const res = await fetch(API_URL + "/query", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  logger.info("Query response received", { status: res.status });

  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
