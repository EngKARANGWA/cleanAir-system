import { ENDPOINTS } from "./config";

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  assignedDevices?: string[];
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

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
  password?: string;
  assignedDevices?: string[];
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
  coInput: number;      // latest CO input ppm, direct field
  coOutput: number;     // latest CO output ppm, direct field
  reduction: number;    // purification %, direct field
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

export interface CreateDevicePayload {
  name: string;
  type: string;
  owner: string;
  plateOrRef: string;
  location: string;
  ip?: string;
  mac?: string;
  firmware?: string;
  safetyStatus?: string;
}

export interface PostReadingPayload {
  inputPpm: number;
  outputPpm: number;
  status?: string;
  uptime?: string;
  firmware?: string;
  ip?: string;
  mac?: string;
}

export interface ApiReading {
  id: string;
  deviceId?: string;
  inputPpm?: number;   // field name used by some backend versions
  outputPpm?: number;
  coInput?: number;    // alternative naming
  coOutput?: number;
  reduction?: number;
  status?: string;
  uptime?: string;
  createdAt?: string;
  timestamp?: string;
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────

async function http<T>(url: string, init: RequestInit = {}, timeoutMs = 30_000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        // Only set Content-Type for requests with a body — adding it to GET
        // requests triggers a CORS preflight that the backend may not handle.
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

    update: (id: string, payload: UpdateUserPayload) =>
      http<AuthUser>(ENDPOINTS.users.update(id), {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      http(ENDPOINTS.users.remove(id), { method: "DELETE" }),
  },

  devices: {
    list: () =>
      http<ApiDevice[]>(ENDPOINTS.devices.list, { cache: "no-store" }),

    get: (id: string) =>
      http<ApiDevice>(ENDPOINTS.devices.one(id)),

    create: (payload: CreateDevicePayload) =>
      http<ApiDevice>(ENDPOINTS.devices.create, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    update: (id: string, payload: Partial<CreateDevicePayload>) =>
      http<ApiDevice>(ENDPOINTS.devices.update(id), {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    remove: (id: string) =>
      http(ENDPOINTS.devices.remove(id), { method: "DELETE" }),

    reboot: (id: string) =>
      http(ENDPOINTS.devices.reboot(id), { method: "POST" }),

    postReading: (id: string, payload: PostReadingPayload) =>
      http(ENDPOINTS.devices.readings(id), {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};
