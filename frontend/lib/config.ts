const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "https://backend-cleanair.onrender.com").replace(/\/$/, "");

export const API_BASE = BASE;

export const ENDPOINTS = {
  auth: {
    login:          `${BASE}/api/auth/login`,
    forgotPassword: `${BASE}/api/auth/forgot-password`,
    resetPassword:  `${BASE}/api/auth/reset-password`,
  },
  users: {
    list:                   `${BASE}/api/admin/users`,
    create:                 `${BASE}/api/admin/users`,
    one:    (id: string) => `${BASE}/api/admin/users/${id}`,
    update: (id: string) => `${BASE}/api/admin/users/${id}`,
    remove: (id: string) => `${BASE}/api/admin/users/${id}`,
  },
  devices: {
    list:                      `${BASE}/api/devices`,
    create:                    `${BASE}/api/devices`,
    one:      (id: string) =>  `${BASE}/api/devices/${id}`,
    update:   (id: string) =>  `${BASE}/api/devices/${id}`,
    remove:   (id: string) =>  `${BASE}/api/devices/${id}`,
    reboot:   (id: string) =>  `${BASE}/api/devices/${id}/reboot`,
    readings: (id: string) =>  `${BASE}/api/devices/${id}/readings`,
  },
};
