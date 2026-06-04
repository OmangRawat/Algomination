import { apiUrl } from "./config";

const ACCESS_KEY = "algo_access";
const REFRESH_KEY = "algo_refresh";

/** JWT token storage backed by localStorage (client-only). */
export const tokenStore = {
  get access() {
    return typeof window === "undefined"
      ? null
      : localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return typeof window === "undefined"
      ? null
      : localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  setAccess(access: string) {
    localStorage.setItem(ACCESS_KEY, access);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/** Error carrying HTTP status and DRF-style per-field messages. */
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[]>;
  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function parseErrors(data: unknown): {
  message: string;
  fieldErrors: Record<string, string[]>;
} {
  if (!data || typeof data !== "object") {
    return { message: "Request failed.", fieldErrors: {} };
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.detail === "string") {
    return { message: obj.detail, fieldErrors: {} };
  }
  const fieldErrors: Record<string, string[]> = {};
  let first = "";
  for (const [key, value] of Object.entries(obj)) {
    const arr = Array.isArray(value) ? value.map(String) : [String(value)];
    fieldErrors[key] = arr;
    if (!first && arr[0]) first = arr[0];
  }
  return { message: first || "Request failed.", fieldErrors };
}

async function rawFetch(
  path: string,
  init: RequestInit,
  auth: boolean,
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (auth && tokenStore.access) {
    headers.Authorization = `Bearer ${tokenStore.access}`;
  }
  return fetch(apiUrl(path), { ...init, headers });
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStore.refresh;
  if (!refresh) return false;
  try {
    const res = await fetch(apiUrl("/auth/refresh/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      tokenStore.clear();
      return false;
    }
    const data = await res.json();
    if (data.access) {
      tokenStore.setAccess(data.access);
      if (data.refresh) localStorage.setItem(REFRESH_KEY, data.refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** Attach the access token and retry once on 401 via refresh. */
  auth?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", body, auth = false }: RequestOptions = {},
): Promise<T> {
  const init: RequestInit = {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  let res: Response;
  try {
    res = await rawFetch(path, init, auth);
    if (res.status === 401 && auth && tokenStore.refresh) {
      if (await tryRefresh()) res = await rawFetch(path, init, auth);
    }
  } catch {
    throw new ApiError(0, "Couldn't reach the server. Is the backend running?");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const { message, fieldErrors } = parseErrors(data);
    throw new ApiError(res.status, message, fieldErrors);
  }
  return data as T;
}
