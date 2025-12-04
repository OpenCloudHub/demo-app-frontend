import { trace, context } from "@opentelemetry/api";

export function log(
  level: "info" | "warn" | "error",
  message: string,
  extra?: Record<string, unknown>
) {
  const span = trace.getSpan(context.active());
  const spanContext = span?.spanContext();

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(spanContext && {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
    }),
    ...extra,
  };

  // Output as JSON for Loki to parse
  console.log(JSON.stringify(logEntry));
}

export const logger = {
  info: (msg: string, extra?: Record<string, unknown>) =>
    log("info", msg, extra),
  warn: (msg: string, extra?: Record<string, unknown>) =>
    log("warn", msg, extra),
  error: (msg: string, extra?: Record<string, unknown>) =>
    log("error", msg, extra),
};
