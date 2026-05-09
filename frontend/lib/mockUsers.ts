import type { AuthUser } from "./api";

interface MockCredential {
  email: string;
  password: string;
  user: AuthUser;
}

// Only OPERATOR uses frontend-only mock credentials.
// All other roles (ADMIN, VIEWER) authenticate through the real backend.
const MOCK_CREDENTIALS: MockCredential[] = [
  {
    email: "operator@cleanair.com",
    password: "Operator@2025",
    user: {
      id: "mock-operator-001",
      name: "Field Operator",
      email: "operator@cleanair.com",
      role: "OPERATOR",
      status: "ACTIVE",
      phone: "+250 788 000 001",
    },
  },
  {
    email: "viewer@cleanair.com",
    password: "Viewer@2025",
    user: {
      id: "mock-viewer-001",
      name: "Site Viewer",
      email: "viewer@cleanair.com",
      role: "VIEWER",
      status: "ACTIVE",
      phone: "+250 788 000 002",
    },
  },
];

export function checkMockCredentials(
  email: string,
  password: string
): AuthUser | null {
  const match = MOCK_CREDENTIALS.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  return match ? match.user : null;
}
