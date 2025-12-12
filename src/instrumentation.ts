/**
 * @fileoverview OpenTelemetry instrumentation setup for Next.js.
 *
 * This file is automatically loaded by Next.js to register instrumentation.
 * It configures the @vercel/otel package for distributed tracing,
 * sending traces to the configured OTLP endpoint (e.g., Grafana Alloy).
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import { registerOTel } from "@vercel/otel";

/**
 * Registers OpenTelemetry instrumentation for the application.
 * Called automatically by Next.js during server startup.
 */
export function register() {
  // Note: logger not available here as this runs before app initialization
  console.log("🔭 OpenTelemetry instrumentation registering...");
  console.log(
    "   OTLP endpoint:",
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "(not set)"
  );

  registerOTel({
    serviceName: "demo-app-frontend",
  });

  console.log("✅ OpenTelemetry registered for service: demo-app-frontend");
}
