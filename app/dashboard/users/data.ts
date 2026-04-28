export type UserRole = "admin" | "operator" | "viewer";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  assignedDevices: string[];
  lastLogin: string;
  joinedAt: string;
  avatar: string;
}

export const users: User[] = [
  {
    id: "USR-001",
    name: "ISHIMWE KARANGWA Cyrille",
    email: "ishimwekarangwa_222016817@stud.ur.ac.rw",
    role: "admin",
    status: "active",
    assignedDevices: ["ESP32-001", "ESP32-002", "ESP32-003", "ESP32-004"],
    lastLogin: "Just now",
    joinedAt: "2026-01-10",
    avatar: "IK",
  },
  {
    id: "USR-002",
    name: "NIYONKURU Olivier",
    email: "niyonkuru.olivier@stud.ur.ac.rw",
    role: "admin",
    status: "active",
    assignedDevices: ["ESP32-001", "ESP32-002", "ESP32-003", "ESP32-004"],
    lastLogin: "1 hr ago",
    joinedAt: "2026-01-10",
    avatar: "NO",
  },
  {
    id: "USR-003",
    name: "Jean-Paul Habimana",
    email: "jp.habimana@cleanair.rw",
    role: "operator",
    status: "active",
    assignedDevices: ["ESP32-001", "ESP32-002"],
    lastLogin: "3 hr ago",
    joinedAt: "2026-02-05",
    avatar: "JH",
  },
  {
    id: "USR-004",
    name: "Aline Uwimana",
    email: "a.uwimana@cleanair.rw",
    role: "operator",
    status: "inactive",
    assignedDevices: ["ESP32-003"],
    lastLogin: "5 days ago",
    joinedAt: "2026-02-18",
    avatar: "AU",
  },
  {
    id: "USR-005",
    name: "Eric Mugisha",
    email: "e.mugisha@cleanair.rw",
    role: "viewer",
    status: "active",
    assignedDevices: ["ESP32-004"],
    lastLogin: "2 days ago",
    joinedAt: "2026-03-01",
    avatar: "EM",
  },
  {
    id: "USR-006",
    name: "Claire Ndayishimiye",
    email: "c.ndayishimiye@cleanair.rw",
    role: "viewer",
    status: "suspended",
    assignedDevices: [],
    lastLogin: "14 days ago",
    joinedAt: "2026-03-15",
    avatar: "CN",
  },
];
