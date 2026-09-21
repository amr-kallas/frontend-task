"use server";

import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { createSession, deleteSession } from "@/lib/auth/session";
import { verifyCredentials } from "@/services/auth.service";

export type LoginState = {
  error?: string;
  username?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required.", username };
  }

  let isValid: boolean;
  try {
    isValid = await verifyCredentials({ username, password });
  } catch {
    return {
      error: "The login service is unavailable. Please try again later.",
      username,
    };
  }

  if (!isValid) {
    return { error: "Invalid username or password.", username };
  }

  await createSession(username);
  redirect(ROUTES.ADMIN);
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect(ROUTES.LOGIN);
}
