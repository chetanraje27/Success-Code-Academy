import {
  adminApiFetch,
  uploadAdminImage as uploadThroughAdminGateway,
} from "./admin-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getApiBase() {
  return API_BASE;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function isAdminUser(user: unknown): boolean {
  return Boolean(
    user &&
      typeof user === "object" &&
      "role" in user &&
      user.role === "admin",
  );
}

// Legacy public-site editors call this helper without generics. Keep the
// default permissive while new admin pages use the strictly typed gateway.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, headers, ...rest } = options;

  if (auth && path.startsWith("/api/v1/admin")) {
    return adminApiFetch<T>(path, { ...rest, headers }) as Promise<T>;
  }

  const finalHeaders = new Headers(headers || {});

  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (rest.body && !(rest.body instanceof FormData) && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  let data: unknown = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        (("message" in data && data.message) || ("error" in data && data.error))) ||
      `Request failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : "Request failed");
  }

  return data as T;
}

export async function uploadAdminImage(
  file: File,
  type: "banner" | "star" | "result" | "uploads" = "uploads"
): Promise<string> {
  return uploadThroughAdminGateway(file, type);
}
