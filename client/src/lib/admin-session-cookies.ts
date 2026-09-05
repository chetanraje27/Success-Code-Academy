export const ADMIN_SESSION_COOKIE = "sca_admin_session";
export const ADMIN_LOGOUT_MARKER_COOKIE = "sca_admin_logout_marker";

const SITE_DOMAIN = "successcodeacademy.in";
const PARENT_COOKIE_DOMAIN = `.${SITE_DOMAIN}`;

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

function isIpv4Address(hostname: string): boolean {
  const parts = hostname.split(".");
  return (
    parts.length === 4 &&
    parts.every((part) => {
      if (!/^\d+$/.test(part)) return false;
      const value = Number(part);
      return value >= 0 && value <= 255;
    })
  );
}

function canUseExactDomainAttribute(hostname: string): boolean {
  return (
    hostname.length > 0 &&
    hostname !== "localhost" &&
    !hostname.endsWith(".localhost") &&
    !hostname.includes(":") &&
    !isIpv4Address(hostname) &&
    !hostname.includes("..") &&
    /^[a-z0-9.-]+$/.test(hostname)
  );
}

/** True for the public site and its trusted subdomains. */
export function isSuccessCodeAcademyHostname(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);
  return (
    normalized === SITE_DOMAIN || normalized.endsWith(`.${SITE_DOMAIN}`)
  );
}

/**
 * The login cookie is intentionally shared by the public site and console in
 * production. Development hosts must remain host-only because browsers reject
 * Domain=localhost (and similar development hostnames).
 */
export function getAdminSessionCookieDomain(
  hostname: string,
): string | undefined {
  return isSuccessCodeAcademyHostname(hostname)
    ? PARENT_COOKIE_DOMAIN
    : undefined;
}

/**
 * Return every cookie scope which may contain an admin session for this host.
 * The three entries are deliberately not collapsed: a parent-domain cookie,
 * an exact-host Domain cookie, and a host-only cookie are different browser
 * cookies even though they share a name and path.
 */
function getAdminSessionCookieClearDomains(
  hostname: string,
): Array<string | undefined> {
  const normalized = normalizeHostname(hostname);
  const domains: Array<string | undefined> = [];

  if (isSuccessCodeAcademyHostname(normalized)) {
    domains.push(PARENT_COOKIE_DOMAIN);
  }

  // An exact-host Domain cookie is a plausible legacy variant on custom and
  // preview DNS hosts. Omit it for localhost/IP hosts, where browsers reject
  // the Domain attribute; the host-only variant below remains valid there.
  if (canUseExactDomainAttribute(normalized)) {
    domains.push(normalized);
  }

  domains.push(undefined);
  return domains;
}

export function getAdminSessionCookieOptions(hostname: string) {
  const domain = getAdminSessionCookieDomain(hostname);
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(domain ? { domain } : {}),
  };
}

function expiredAdminSessionCookie(
  domain: string | undefined,
  secure: boolean,
): string {
  const attributes = [
    `${ADMIN_SESSION_COOKIE}=`,
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Path=/",
    ...(domain ? [`Domain=${domain}`] : []),
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ];

  return attributes.join("; ");
}

function adminLogoutMarkerCookie(
  domain: string | undefined,
  secure: boolean,
): string {
  const attributes = [
    `${ADMIN_LOGOUT_MARKER_COOKIE}=1`,
    "Max-Age=60",
    "Path=/",
    ...(domain ? [`Domain=${domain}`] : []),
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ];

  return attributes.join("; ");
}

function expiredAdminLogoutMarkerCookie(
  domain: string | undefined,
  secure: boolean,
): string {
  const attributes = [
    `${ADMIN_LOGOUT_MARKER_COOKIE}=`,
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Path=/",
    ...(domain ? [`Domain=${domain}`] : []),
    "HttpOnly",
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ];

  return attributes.join("; ");
}

/**
 * Append, rather than set, each expiry header. Using Headers.append is
 * important here: response.cookies.set() can replace same-name entries in
 * some Next/Vercel response paths, leaving a legacy domain cookie alive.
 */
export function appendExpiredAdminSessionCookies(
  headers: Headers,
  hostname: string,
): void {
  const secure = process.env.NODE_ENV === "production";

  for (const domain of getAdminSessionCookieClearDomains(hostname)) {
    headers.append(
      "Set-Cookie",
      expiredAdminSessionCookie(domain, secure),
    );
  }
}

/** Set a short-lived cross-host logout marker before a redirect chain. */
export function appendAdminLogoutMarkerCookie(
  headers: Headers,
  hostname: string,
): void {
  const secure = process.env.NODE_ENV === "production";
  for (const domain of getAdminSessionCookieClearDomains(hostname)) {
    headers.append("Set-Cookie", adminLogoutMarkerCookie(domain, secure));
  }
}

/** Clear the cross-host logout marker after the redirect chain completes. */
export function appendExpiredAdminLogoutMarkerCookies(
  headers: Headers,
  hostname: string,
): void {
  const secure = process.env.NODE_ENV === "production";
  for (const domain of getAdminSessionCookieClearDomains(hostname)) {
    headers.append(
      "Set-Cookie",
      expiredAdminLogoutMarkerCookie(domain, secure),
    );
  }
}
