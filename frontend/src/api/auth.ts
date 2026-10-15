import { API_URL } from "@/api/client";
import type { AuthUser, LoginInput, LoginResponse } from "@/types/auth";

const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  // Guard against non-JSON responses (e.g. an HTML error page) so the user sees a readable error
  const data = await res.json().catch(() => ({}));
  // The backend sends { message } on 400/401, so surface it as the error text
  if (!res.ok) throw new Error(data.message ?? "Login failed");
  if (!data.accessToken) throw new Error("Login failed: no token received");
  return data;
}

export function saveSession({ accessToken, user }: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Returns the stored token only while it is still valid; an expired or malformed token is cleared
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    return token;
  } catch {
    clearSession();
    return null;
  }
}
