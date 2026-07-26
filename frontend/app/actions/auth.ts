"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  login as apiLogin,
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  setAccessToken,
  type LoginResponse,
  type RegisterResponse,
  type ForgotPasswordResponse,
} from "@/lib/auth/service";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
  input: z.infer<typeof loginSchema>
): Promise<ActionResponse<LoginResponse>> {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await apiLogin(result.data);
    const cookieStore = await cookies();
    cookieStore.set("access_token", res.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      httpOnly: false,
    });
    revalidatePath("/", "layout");
    return { success: true, data: res };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to log in";
    return { success: false, error: message };
  }
}

export async function registerAction(
  input: z.infer<typeof registerSchema>
): Promise<ActionResponse<RegisterResponse>> {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await apiRegister(result.data);
    return { success: true, data: res };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register";
    return { success: false, error: message };
  }
}

export async function forgotPasswordAction(
  input: z.infer<typeof forgotPasswordSchema>
): Promise<ActionResponse<ForgotPasswordResponse>> {
  const result = forgotPasswordSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await apiForgotPassword(result.data);
    return { success: true, data: res };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to request password reset";
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<ActionResponse<void>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to log out";
    return { success: false, error: message };
  }
}
