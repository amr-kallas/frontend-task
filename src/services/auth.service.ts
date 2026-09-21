import "server-only";

import API_ROUTES from "@/constants/api-routes";
import { ApiError, http } from "@/lib/fetch";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export async function verifyCredentials(
  payload: LoginPayload,
): Promise<boolean> {
  try {
    await http.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, payload);
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      return false;
    }
    throw error;
  }
}
