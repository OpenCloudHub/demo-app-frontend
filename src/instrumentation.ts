import { registerOTel } from "@vercel/otel";

export function register() {
  console.log("🔭 OpenTelemetry instrumentation registering...");
  console.log("OTLP endpoint:", process.env.OTEL_EXPORTER_OTLP_ENDPOINT);

  registerOTel({
    serviceName: "demo-app-frontend",
  });

  console.log("✅ OpenTelemetry registered");
}
