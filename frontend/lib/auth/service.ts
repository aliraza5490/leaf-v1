export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  email: string;
  full_name: string | null;
  message: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ApiError {
  detail: string;
}

class AuthError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (data as ApiError).detail ??
      `Request failed with status ${response.status}`;
    throw new AuthError(message, response.status);
  }

  return data as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const data = await post<LoginResponse>("/auth/login", credentials);
  await setAccessToken(data.access_token);
  return data;
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  return post<RegisterResponse>("/auth/register", data);
}

export async function forgotPassword(
  data: ForgotPasswordData
): Promise<ForgotPasswordResponse> {
  return post<ForgotPasswordResponse>("/auth/forgot-password", data);
}

const TOKEN_KEY = "access_token";

export async function setAccessToken(token: string): Promise<void> {
  if (typeof window !== "undefined") {
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      cookieStore.set(TOKEN_KEY, token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        httpOnly: false,
      });
    } catch {
      // Ignore if headers are already sent
    }
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(new RegExp("(?:^|; )" + TOKEN_KEY + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      return cookieStore.get(TOKEN_KEY)?.value ?? null;
    } catch {
      return null;
    }
  }
}

export async function removeAccessToken(): Promise<void> {
  if (typeof window !== "undefined") {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      cookieStore.delete(TOKEN_KEY);
    } catch {
      // Ignore if headers are already sent
    }
  }
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface UserProfile {
  email: string;
  full_name: string | null;
  store_id: number;
  role: string;
  isActive: boolean;
}

export async function getMe(): Promise<UserProfile> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}${API_PREFIX}/auth/me`,
    { headers, cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
}

