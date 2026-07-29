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
  // Step 1: Request a Signed Upload URL from our secure backend
  const response = await adminApiFetch<{ signedUrl: string, publicUrl: string }>(
    `upload/signed-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        type,
      }),
    },
  );

  const { signedUrl, publicUrl } = response.data;

  // Step 2: Upload the binary directly to Supabase using the signed URL
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file directly to storage");
  }

  // Step 3: Return the final public URL
  return publicUrl;
}
