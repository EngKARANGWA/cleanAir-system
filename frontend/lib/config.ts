// Local development
// const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Production — Render backend
// const BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://clean-air-system-api.onrender.com";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://cleanair-system.vercel.app/";

export const API_BASE = BASE;

export const ENDPOINTS = {
  auth: {
    login:          `${BASE}/api/auth/login`,
    forgotPassword: `${BASE}/api/auth/forgot-password`,
    resetPassword:  `${BASE}/api/auth/reset-password`,
  },
  users: {
    list:                    `${BASE}/api/admin/users`,
    create:                  `${BASE}/api/admin/users`,
    one:    (id: string) =>  `${BASE}/api/admin/users/${id}`,
    update: (id: string) =>  `${BASE}/api/admin/users/${id}`,
    remove: (id: string) =>  `${BASE}/api/admin/users/${id}`,
  },
  devices: {
    list:                    `${BASE}/api/devices`,
    create:                  `${BASE}/api/devices`,
    one:    (id: string) =>  `${BASE}/api/devices/${id}`,
    update: (id: string) =>  `${BASE}/api/devices/${id}`,
    remove: (id: string) =>  `${BASE}/api/devices/${id}`,
  },
  readings: {
    latest:  `${BASE}/api/readings/latest`,
    history: `${BASE}/api/readings/history`,
  },
  alerts: {
    list:   `${BASE}/api/alerts`,
    rules:  `${BASE}/api/alerts/rules`,
  },
};
