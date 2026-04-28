export type DeviceStatus = "online" | "offline" | "warning";

export interface Device {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  coInput: number;
  coOutput: number;
  reduction: number;
  uptime: string;
  lastSeen: string;
  firmware: string;
  ip: string;
  mac: string;
  installedAt: string;
}

export const devices: Device[] = [
  {
    id: "ESP32-001",
    name: "Unit A — Main Gate",
    location: "Kigali, Rwanda · Gate Entrance",
    status: "online",
    coInput: 440,
    coOutput: 218,
    reduction: 50.5,
    uptime: "12d 4h",
    lastSeen: "Just now",
    firmware: "v2.1.3",
    ip: "192.168.1.101",
    mac: "A4:CF:12:7E:3B:01",
    installedAt: "2026-01-15",
  },
  {
    id: "ESP32-002",
    name: "Unit B — Parking Zone",
    location: "Kigali, Rwanda · Parking Area",
    status: "warning",
    coInput: 510,
    coOutput: 265,
    reduction: 48.0,
    uptime: "3d 11h",
    lastSeen: "2 min ago",
    firmware: "v2.1.3",
    ip: "192.168.1.102",
    mac: "A4:CF:12:7E:3B:02",
    installedAt: "2026-01-22",
  },
  {
    id: "ESP32-003",
    name: "Unit C — Workshop Bay",
    location: "Kigali, Rwanda · Workshop",
    status: "offline",
    coInput: 0,
    coOutput: 0,
    reduction: 0,
    uptime: "—",
    lastSeen: "2 hr ago",
    firmware: "v2.0.9",
    ip: "192.168.1.103",
    mac: "A4:CF:12:7E:3B:03",
    installedAt: "2026-02-03",
  },
  {
    id: "ESP32-004",
    name: "Unit D — Loading Bay",
    location: "Kigali, Rwanda · Loading Dock",
    status: "online",
    coInput: 395,
    coOutput: 192,
    reduction: 51.4,
    uptime: "7d 2h",
    lastSeen: "Just now",
    firmware: "v2.1.3",
    ip: "192.168.1.104",
    mac: "A4:CF:12:7E:3B:04",
    installedAt: "2026-02-10",
  },
];
