import { apiFetch } from "@/api/client";
import type { SaveUserInput, User } from "@/types/user";

// Every user request in the app goes through this file.
// deleteUser will fail until its backend route is added.

export function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users");
}

// Creates a user, or updates the one with input.id. The backend answers with
// { message }, not the user, so callers refetch the list.
export function saveUser(input: SaveUserInput): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/users/save-user", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}
