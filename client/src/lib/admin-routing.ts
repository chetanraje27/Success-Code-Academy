/**
 * Subdomain and routing helpers for the Success Code Academy Admin Console.
 * Ensures seamless operation on both https://console.successcodeacademy.in
 * and fallback / development environments (e.g. localhost:3000/admin).
 */

export function isConsoleSubdomain(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return (
    hostname.startsWith("console.") ||
    !window.location.pathname.startsWith("/admin")
  );
}

/**
 * Returns the absolute or relative URL to the public live website.
 * When on console.successcodeacademy.in, links must point to the main domain.
 */
export function getLiveWebsiteHref(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.startsWith("console.")) {
      if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
        const port = window.location.port ? `:${window.location.port}` : "";
        return `${window.location.protocol}//localhost${port}${normalizedPath}`;
      }
      return `https://successcodeacademy.in${normalizedPath}`;
    }
  }
  return normalizedPath;
}

/**
 * Returns the URL for the admin console dashboard.
 * When on the public site in production, directs to https://console.successcodeacademy.in
 */
export function getConsoleDashboardHref(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("successcodeacademy.in")) {
      return "https://console.successcodeacademy.in";
    }
  }
  return "/admin";
}

/**
 * Transforms an internal admin route (e.g. /admin/database/students)
 * into a clean path (/database/students) when on the console subdomain,
 * while preserving standard /admin paths when in local development.
 */
export function getAdminHref(path: string, isSubdomain?: boolean): string {
  // Handle live website editor link specially
  if (path === "/?edit=1" || path.startsWith("/?")) {
    return getLiveWebsiteHref(path);
  }

  const activeSubdomain =
    typeof isSubdomain === "boolean" ? isSubdomain : isConsoleSubdomain();

  if (activeSubdomain) {
    if (path === "/admin") return "/";
    if (path.startsWith("/admin/")) return path.replace(/^\/admin/, "");
    return path;
  }

  return path;
}
