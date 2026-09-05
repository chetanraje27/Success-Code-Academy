"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/*
 * Web Analytics tracks the public website only. The admin console (the
 * console.* subdomain and every /admin path) is internal traffic and would
 * otherwise dominate the visitor numbers, so those events are dropped here.
 *
 * This must be a client component: beforeSend is a function and cannot be
 * passed from the server-rendered root layout.
 */
function analyticsBeforeSend(event: BeforeSendEvent) {
  try {
    const url = new URL(event.url, "https://successcodeacademy.in");
    if (
      url.hostname.startsWith("console.") ||
      url.pathname === "/admin" ||
      url.pathname.startsWith("/admin/")
    ) {
      return null;
    }
  } catch {
    return event;
  }
  return event;
}

export default function AnalyticsTracker() {
  return <Analytics beforeSend={analyticsBeforeSend} />;
}
