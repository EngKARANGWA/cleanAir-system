import type { ApiDevice } from "../../../lib/api";

export type DeviceStatus = "online" | "offline" | "warning";
export type VehicleType  = "car" | "motorcycle" | "industry";

export interface Device {
  id: string;
  name: string;
  type: VehicleType;
  owner: string;
  plateOrRef: string;
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

// Map both "car" (API lowercase) and "CAR" (Swagger DTO uppercase) just in case
const TYPE_MAP: Record<string, VehicleType> = {
  car: "car",           motorcycle: "motorcycle",           industry: "industry",
  CAR: "car",           MOTORCYCLE: "motorcycle",           INDUSTRY: "industry",
};

// API returns status as "ONLINE" / "OFFLINE" / "WARNING"
const STATUS_MAP: Record<string, DeviceStatus> = {
  ONLINE:   "online",
  OFFLINE:  "offline",
  WARNING:  "warning",
  CRITICAL: "warning",
  // fallback from safetyStatus field
  NORMAL:   "online",
};

export function mapApiDevice(d: ApiDevice): Device {
  // API returns coInput/coOutput/reduction directly on the device object
  const input     = d.coInput  ?? 0;
  const output    = d.coOutput ?? 0;
  const reduction = d.reduction ?? (
    input > 0 ? Math.round(((input - output) / input) * 1000) / 10 : 0
  );

  const status: DeviceStatus =
    STATUS_MAP[d.status] ??
    STATUS_MAP[d.safetyStatus ?? ""] ??
    "online";

  // API provides lastSeen as ISO string; format it for display
  const lastSeen = d.lastSeen
    ? new Date(d.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : (d.updatedAt
        ? new Date(d.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—");

  const installedAt = d.installedAt
    ? new Date(d.installedAt).toLocaleDateString()
    : (d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—");

  return {
    id:          d.id,
    name:        d.name,
    type:        TYPE_MAP[d.type] ?? "car",
    owner:       d.owner,
    plateOrRef:  d.plateOrRef,
    location:    d.location,
    status,
    coInput:     input,
    coOutput:    output,
    reduction:   typeof reduction === "number" ? reduction : 0,
    uptime:      d.uptime    ?? "—",
    lastSeen,
    firmware:    d.firmware  ?? "—",
    ip:          d.ip        ?? "—",
    mac:         d.mac       ?? "—",
    installedAt,
  };
}
