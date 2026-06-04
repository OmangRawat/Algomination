import { apiFetch, tokenStore } from "./client";
import type { User } from "./types";

export async function loginRequest(
  email: string,
  password: string,
): Promise<void> {
  const data = await apiFetch<{ access: string; refresh: string }>(
    "/auth/login/",
    { method: "POST", body: { email, password } },
  );
  tokenStore.set(data.access, data.refresh);
}

export async function registerRequest(
  email: string,
  name: string,
  password: string,
): Promise<User> {
  const data = await apiFetch<{ user: User; access: string; refresh: string }>(
    "/auth/register/",
    { method: "POST", body: { email, name, password } },
  );
  tokenStore.set(data.access, data.refresh);
  return data.user;
}

export async function fetchMe(): Promise<User> {
  return apiFetch<User>("/auth/me/", { auth: true });
}
