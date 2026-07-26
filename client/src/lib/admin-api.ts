"use client";

export type AdminUser = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber: string;
  role: "admin";
};

export type ApiEnvelope<T> = {
  status: "success" | "fail" | "error";
  data: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    nextCursor: number | null;
    hasMore: boolean;
    limit: number;
  };
  success: boolean;
};

export class AdminApiError extends Error {
  status: number;
  fields: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    fields: Array<{ field: string; message: string }> = [],
  ) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.fields = fields;
  }
}

function adminPath(path: string): string {
  const clean = path
    .replace(/^\/api\/v1\/admin\/?/, "")
    .replace(/^\/api\/admin\/?/, "")
    .replace(/^\/+/, "");
  return `/api/admin/${clean}`;
}

export async function adminApiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const headers = new Headers(options.headers);
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(adminPath(path), {
    ...options,
    credentials: "same-origin",
    headers,
    cache: "no-store",
  });

  const raw = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    payload = { message: raw };
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin-session-expired"));
    }
    throw new AdminApiError(
      typeof payload.message === "string"
        ? payload.message
        : `Request failed (${response.status})`,
      response.status,
      Array.isArray(payload.errors)
        ? (payload.errors as Array<{ field: string; message: string }>)
        : [],
    );
  }

  return {
    ...(payload as Omit<ApiEnvelope<T>, "success">),
    success: payload.status ? payload.status === "success" : true,
  } as ApiEnvelope<T>;
}

export async function uploadAdminImage(
  file: File,
  type: "banner" | "star" | "result" | "uploads" | "news" | "video" = "uploads",
): Promise<string> {
  const body = new FormData();
  body.append("image", file);
  const response = await adminApiFetch<{ url: string }>(
    `upload?type=${type}`,
    { method: "POST", body },
  );
  return response.data.url;
}
