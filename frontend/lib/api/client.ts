import { getAuthHeaders } from "@/lib/auth/service";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export interface ApiError {
  detail: string;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiClientError";
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

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...extra,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as ApiError).detail ??
      `Request failed with status ${response.status}`;
    throw new ApiClientError(message, response.status);
  }

  return data as T;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    method: "GET",
    headers: buildHeaders(),
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    headers: buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "DELETE",
    headers: buildHeaders(),
  });
  return handleResponse<T>(response);
}
