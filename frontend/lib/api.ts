import { ENDPOINTS } from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
}

export interface LoginResponse {
  user?: AuthUser;
  requiresReset?: boolean;
  email?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  role: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "Request failed");
  return data as T;
}

// ─── API surface ──────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: (email: string, password: string) =>
      http<LoginResponse>(ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    forgotPassword: (email: string) =>
      http(ENDPOINTS.auth.forgotPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    resetPassword: (payload: { token: string; newPassword: string; email: string }) =>
      http(ENDPOINTS.auth.resetPassword, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  users: {
    list: () =>
      http<AuthUser[]>(ENDPOINTS.users.list, { cache: "no-store" }),

    get: (id: string) =>
      http<AuthUser>(ENDPOINTS.users.one(id)),

    create: (payload: UserPayload) =>
      http<AuthUser>(ENDPOINTS.users.create, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: Partial<UpdateProfilePayload>) =>
      http<AuthUser>(ENDPOINTS.users.update(id), {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      http(ENDPOINTS.users.remove(id), { method: "DELETE" }),
  },

  devices: {
    list: () =>
      http<unknown[]>(ENDPOINTS.devices.list, { cache: "no-store" }),

    get: (id: string) =>
      http<unknown>(ENDPOINTS.devices.one(id)),
  },

  readings: {
    latest: () => http<unknown>(ENDPOINTS.readings.latest),
    history: () => http<unknown[]>(ENDPOINTS.readings.history),
  },

  alerts: {
    list: () => http<unknown[]>(ENDPOINTS.alerts.list),
  },
};
