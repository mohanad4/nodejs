import { clearSession, getToken } from "@/api/auth";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:7000/api";

// fetch wrapper for authenticated endpoints: sends the Bearer token, turns the backend's
// { message } error bodies into thrown Errors, and sends the user to /login on 401.
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  // Guard against empty or non-JSON responses (e.g. 204 or an HTML error page)
  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    clearSession();
    window.location.assign("/login");
  }
  if (!res.ok) throw new Error(data?.message ?? `Request failed (${res.status})`);
  return data as T;
}
