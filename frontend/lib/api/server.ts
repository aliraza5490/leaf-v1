import { cookies } from "next/headers";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export interface ApiError {
  detail: string;
}

export class ApiServerError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiServerError";
  }
}

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(
    `${API_PREFIX}${path}`,
    API_BASE_URL.startsWith("http") ? API_BASE_URL : `http://${API_BASE_URL}`
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function buildHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
  let token: string | null = null;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("access_token")?.value ?? null;
  } catch {
    // If not in request context
  }

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as ApiError).detail ??
      `Request failed with status ${response.status}`;
    throw new ApiServerError(message, response.status);
  }

  return data as T;
}

export async function serverApiGet<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<T> {
  const headers = await buildHeaders();
  const response = await fetch(buildUrl(path, params), {
    method: "GET",
    headers,
    cache: "no-store",
  });
  return handleResponse<T>(response);
}

export async function serverApiPost<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const headers = await buildHeaders();
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return handleResponse<T>(response);
}

export async function serverApiPut<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const headers = await buildHeaders();
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return handleResponse<T>(response);
}

export async function serverApiDelete<T>(path: string): Promise<T> {
  const headers = await buildHeaders();
  const response = await fetch(buildUrl(path), {
    method: "DELETE",
    headers,
    cache: "no-store",
  });
  return handleResponse<T>(response);
}
