import { trace } from "@opentelemetry/api";
import { SessionResponse } from "./types";

const tracer = trace.getTracer("demo-app-frontend");

export async function createSession(): Promise<SessionResponse> {
  return tracer.startActiveSpan("createSession", async (span) => {
    try {
      const res = await fetch("/api/chat/session", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create session");
      const data = await res.json();
      span.setAttribute("session.id", data.session_id);
      return data;
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

export async function deleteSession(sessionId: string): Promise<void> {
  return tracer.startActiveSpan("deleteSession", async (span) => {
    try {
      span.setAttribute("session.id", sessionId);
      await fetch("/api/chat/session/" + sessionId, { method: "DELETE" });
    } catch (error) {
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

export async function streamQuery(
  question: string,
  sessionId: string,
  onToken: (token: string) => void,
  onError: (error: string) => void
): Promise<void> {
  const res = await fetch("/api/chat/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      session_id: sessionId,
      stream: true,
    }),
  });

  if (!res.ok) throw new Error("HTTP " + res.status);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error("No reader");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      const lines = part.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          if (data.startsWith("[ERROR]")) {
            onError(data);
            continue;
          }
          onToken(data);
        }
      }
    }
  }
}
