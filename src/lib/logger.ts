/**
 * @fileoverview Structured logging utility with OpenTelemetry trace correlation.
 *
 * This module provides a logger that outputs JSON-formatted log entries,
 * automatically including trace_id and span_id from the active OpenTelemetry
 * context. This enables log-trace correlation in Grafana/Loki.
 */

import { trace, context } from "@opentelemetry/api";

/**
 * Logs a structured message with OpenTelemetry trace context.
 *
 * @param level - The severity level of the log entry
 * @param message - The log message
 * @param extra - Additional key-value pairs to include in the log
 */
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
