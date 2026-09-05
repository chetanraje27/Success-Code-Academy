import { NextResponse, type NextRequest } from "next/server";
import {
  appendAdminLogoutMarkerCookie,
  appendExpiredAdminSessionCookies,
} from "@/lib/admin-session-cookies";

const PUBLIC_HOSTS = new Set([
  "successcodeacademy.in",
  "www.successcodeacademy.in",
]);
const CONSOLE_HOST = "console.successcodeacademy.in";
const PUBLIC_HOME_URL = "https://successcodeacademy.in/";
const CONSOLE_LOGIN_URL = "https://console.successcodeacademy.in/login";
const CONSOLE_LOGOUT_URL =
  "https://console.successcodeacademy.in/api/admin/logout";

export const dynamic = "force-dynamic";

function normalizedHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

function isConsoleHost(hostname: string): boolean {
  const normalized = normalizedHostname(hostname);
  // Keep clean console URLs working for both production and local console
  // aliases. The API guard in middleware prevents this rule from touching API
  // requests during the cross-origin logout hop.
  return normalized === CONSOLE_HOST || normalized.startsWith("console.");
}

function isPublicHost(hostname: string): boolean {
  return PUBLIC_HOSTS.has(normalizedHostname(hostname));
}

function isSafeRelativePath(value: string): boolean {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

function fallbackDestination(request: NextRequest): URL {
  const hostname = normalizedHostname(request.nextUrl.hostname);
  if (isConsoleHost(hostname)) {
    return new URL("/login", request.url);
  }
  if (isPublicHost(hostname)) {
    return new URL("/", request.url);
  }

  // Local development keeps the destination on the current origin and uses
  // the admin fallback route when no explicit return target was supplied.
  return new URL("/admin/login", request.url);
}

function isProductionPublicRoot(destination: URL): boolean {
  const hostname = normalizedHostname(destination.hostname);
  return (
    destination.protocol === "https:" &&
    destination.port === "" &&
    destination.username === "" &&
    destination.password === "" &&
    destination.pathname === "/" &&
    destination.search === "" &&
    destination.hash === "" &&
    PUBLIC_HOSTS.has(hostname)
  );
}

function isProductionConsoleLogin(destination: URL): boolean {
  return (
    destination.protocol === "https:" &&
    destination.port === "" &&
    destination.username === "" &&
    destination.password === "" &&
    destination.pathname === "/login" &&
    destination.search === "" &&
    destination.hash === "" &&
    normalizedHostname(destination.hostname) === CONSOLE_HOST
  );
}

function canonicalProductionTarget(destination: URL): URL | null {
  if (isProductionPublicRoot(destination)) {
    return new URL(PUBLIC_HOME_URL);
  }
  if (isProductionConsoleLogin(destination)) {
    return new URL(CONSOLE_LOGIN_URL);
  }
  return null;
}

/**
 * Validate the browser return target at the route boundary. Relative paths
 * must stay on the current origin. Absolute URLs are intentionally limited to
 * the two production destinations used by the public/console logout chain.
 */
function validatedDestination(request: NextRequest): URL {
  const raw = request.nextUrl.searchParams.get("returnTo");
  const fallback = fallbackDestination(request);
  if (!raw || raw.length > 2048 || /[\u0000-\u001f\u007f]/.test(raw)) {
    return fallback;
  }

  const requestHostname = normalizedHostname(request.nextUrl.hostname);

  if (isSafeRelativePath(raw)) {
    try {
      const destination = new URL(raw, request.url);
      if (destination.origin !== request.nextUrl.origin) {
        return fallback;
      }

      // Production public and console hosts only have one valid local return
      // page. This prevents a relative path from becoming an open redirect or
      // from sending the clean console back to its dashboard after logout.
      if (isConsoleHost(requestHostname)) {
        if (
          destination.pathname !== "/login" ||
          destination.search !== "" ||
          destination.hash !== ""
        ) {
          return fallback;
        }
      } else if (isPublicHost(requestHostname)) {
        if (
          destination.pathname !== "/" ||
          destination.search !== "" ||
          destination.hash !== ""
        ) {
          return fallback;
        }
      }

      return destination;
    } catch {
      return fallback;
    }
  }

  try {
    return canonicalProductionTarget(new URL(raw)) || fallback;
  } catch {
    return fallback;
  }
}

function publicLogoutDestination(request: NextRequest): URL {
  // A public-site logout always finishes at the public home. Validate the
  // incoming value first, but do not let even the separately trusted console
  // login target change this cross-origin chain's final destination.
  validatedDestination(request);
  const destination = new URL(CONSOLE_LOGOUT_URL);
  destination.searchParams.set("returnTo", PUBLIC_HOME_URL);
  return destination;
}

function consoleLogoutDestination(request: NextRequest): URL {
  const validated = validatedDestination(request);
  if (isProductionConsoleLogin(validated)) {
    // Keep the console's final redirect relative so middleware rewrites the
    // clean /login URL to /admin/login exactly once.
    return new URL("/login", request.url);
  }
  return validated;
}

function logoutDestination(request: NextRequest): URL {
  const hostname = normalizedHostname(request.nextUrl.hostname);
  if (isPublicHost(hostname)) {
    return publicLogoutDestination(request);
  }
  if (isConsoleHost(hostname)) {
    return consoleLogoutDestination(request);
  }
  return validatedDestination(request);
}

/**
 * Browser logout deliberately does not authenticate first. Its only stateful
 * action is expiring the possible cookie scopes before following the safe
 * redirect chain.
 */
function logoutResponse(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(logoutDestination(request), 303);
  appendExpiredAdminSessionCookies(
    response.headers,
    request.nextUrl.hostname,
  );
  // The marker survives the cross-host redirect chain and forces the session
  // endpoint to report no admin until a deliberate new login clears it.
  appendAdminLogoutMarkerCookie(
    response.headers,
    request.nextUrl.hostname,
  );
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export function GET(request: NextRequest): NextResponse {
  return logoutResponse(request);
}

// Keep older callers harmlessly idempotent while the browser flow uses GET.
export function POST(request: NextRequest): NextResponse {
  return logoutResponse(request);
}

export function DELETE(request: NextRequest): NextResponse {
  return logoutResponse(request);
}
