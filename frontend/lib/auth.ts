import type { AuthUser } from "./api";

export const auth = {
  get: (): AuthUser | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },

  set: (user: AuthUser): void => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  clear: (): void => {
    localStorage.removeItem("user");
  },

  isActive: (): boolean => {
    return auth.get()?.status === "ACTIVE";
  },

  role: (): string => {
    return (auth.get()?.role ?? "VIEWER").toUpperCase();
  },
};
