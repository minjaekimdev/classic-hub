import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@app/styles/main.css";
import App from "./App";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

Sentry.init({
  dsn: "https://aaa9941a4ef812ffefc0f4422674dcfc@o4511156351795200.ingest.us.sentry.io/4511156353236992",
  sendDefaultPii: true,

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
);
