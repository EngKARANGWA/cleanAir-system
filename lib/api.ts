import type { AuthUser } from "./mockUsers";

export interface LoginResponse {
  user?: AuthUser;
  requiresReset?: boolean;
  email?: string;
  message?: string;
}

// ─── Device types ─────────────────────────────────────────────────────────────

export interface ApiDevice {
  id: string;
  name: string;
  type: string;         // "car" | "motorcycle" | "industry" (lowercase from API)
  owner: string;
  plateOrRef: string;
  location: string;
  status: string;       // "ONLINE" | "OFFLINE" | "WARNING"
  coInput: number;      // latest CO input ppm — direct field on device
  coOutput: number;     // latest CO output ppm — direct field on device
  reduction: number;    // purification % — direct field on device
  uptime?: string;
  lastSeen?: string;
  firmware?: string;
  ip?: string;
  mac?: string;
  installedAt?: string;
  safetyStatus?: string; // "NORMAL" | "WARNING" | "CRITICAL"
  createdAt?: string;
  updatedAt?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "https://backend-cleanair.onrender.com").replace(/\/$/, "");

const ENDPOINTS = {
  auth: {
    login:          `${BASE}/api/auth/login`,
    forgotPassword: `${BASE}/api/auth/forgot-password`,
    resetPassword:  `${BASE}/api/auth/reset-password`,
  },
  devices: {
    list:                     `${BASE}/api/devices`,
    create:                   `${BASE}/api/devices`,
    one:   (id: string) =>    `${BASE}/api/devices/${id}`,
    update:(id: string) =>    `${BASE}/api/devices/${id}`,
    remove:(id: string) =>    `${BASE}/api/devices/${id}`,
  },
};

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function http<T>(url: string, init: RequestInit = {}, timeoutMs = 30_000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        // Only add Content-Type when sending a body — adding it to GET requests
        // triggers a CORS preflight that the backend doesn't handle.
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data as { message?: string }).message ?? "Request failed");
    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out — the server may be starting up. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
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

  devices: {
    list: () =>
      http<ApiDevice[]>(ENDPOINTS.devices.list),

    get: (id: string) =>
      http<ApiDevice>(ENDPOINTS.devices.one(id)),

    create: (payload: Omit<ApiDevice, "id" | "coInput" | "coOutput" | "reduction" | "status" | "safetyStatus" | "createdAt" | "updatedAt" | "lastSeen">) =>
      http<ApiDevice>(ENDPOINTS.devices.create, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: Partial<ApiDevice>) =>
      http<ApiDevice>(ENDPOINTS.devices.update(id), {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      http(ENDPOINTS.devices.remove(id), { method: "DELETE" }),
  },
};
