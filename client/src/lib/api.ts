const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getApiBase() {
  return API_BASE;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getStoredUser<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function isAdminUser(user: any): boolean {
  if (!user) return false;
  return user.role === "admin" || user.mobileNumber === "9699062427";
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, headers, ...rest } = options;
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

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : "Request failed");
  }

  return data as T;
}

export async function uploadAdminImage(
  file: File,
  type: "banner" | "star" | "result" | "uploads" = "uploads"
): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const data = await apiFetch<{ status: string; data: { url: string } }>(
    `/api/v1/admin/upload?type=${type}`,
    { method: "POST", body: form, auth: true }
  );
  return data.data.url;
}
