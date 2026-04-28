export interface Reading {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  device: string;
  location: string;
  coInput: number;
  coOutput: number;
  reduction: number;
  status: "normal" | "warning" | "critical";
}

export const readings: Reading[] = [
  { id: "R001", timestamp: "2026-04-21 06:00:12", date: "2026-04-21", time: "06:00:12", device: "ESP32-001", location: "Main Gate",    coInput: 440, coOutput: 218, reduction: 50.5, status: "normal" },
  { id: "R002", timestamp: "2026-04-21 05:57:08", date: "2026-04-21", time: "05:57:08", device: "ESP32-002", location: "Parking Zone", coInput: 510, coOutput: 265, reduction: 48.0, status: "warning" },
  { id: "R003", timestamp: "2026-04-21 05:54:33", date: "2026-04-21", time: "05:54:33", device: "ESP32-001", location: "Main Gate",    coInput: 395, coOutput: 192, reduction: 51.4, status: "normal" },
  { id: "R004", timestamp: "2026-04-21 05:51:20", date: "2026-04-21", time: "05:51:20", device: "ESP32-004", location: "Loading Bay",  coInput: 620, coOutput: 298, reduction: 51.9, status: "critical" },
  { id: "R005", timestamp: "2026-04-21 05:48:44", date: "2026-04-21", time: "05:48:44", device: "ESP32-002", location: "Parking Zone", coInput: 480, coOutput: 238, reduction: 50.4, status: "warning" },
  { id: "R006", timestamp: "2026-04-21 05:45:11", date: "2026-04-21", time: "05:45:11", device: "ESP32-001", location: "Main Gate",    coInput: 420, coOutput: 205, reduction: 51.2, status: "normal" },
  { id: "R007", timestamp: "2026-04-21 05:42:58", date: "2026-04-21", time: "05:42:58", device: "ESP32-004", location: "Loading Bay",  coInput: 380, coOutput: 188, reduction: 50.5, status: "normal" },
  { id: "R008", timestamp: "2026-04-21 05:39:30", date: "2026-04-21", time: "05:39:30", device: "ESP32-001", location: "Main Gate",    coInput: 455, coOutput: 222, reduction: 51.2, status: "warning" },
  { id: "R009", timestamp: "2026-04-21 05:36:17", date: "2026-04-21", time: "05:36:17", device: "ESP32-002", location: "Parking Zone", coInput: 500, coOutput: 248, reduction: 50.4, status: "warning" },
  { id: "R010", timestamp: "2026-04-21 05:33:02", date: "2026-04-21", time: "05:33:02", device: "ESP32-004", location: "Loading Bay",  coInput: 410, coOutput: 200, reduction: 51.2, status: "normal" },
  { id: "R011", timestamp: "2026-04-21 05:30:45", date: "2026-04-21", time: "05:30:45", device: "ESP32-001", location: "Main Gate",    coInput: 390, coOutput: 191, reduction: 51.0, status: "normal" },
  { id: "R012", timestamp: "2026-04-21 05:27:19", date: "2026-04-21", time: "05:27:19", device: "ESP32-002", location: "Parking Zone", coInput: 560, coOutput: 275, reduction: 50.9, status: "critical" },
  { id: "R013", timestamp: "2026-04-20 23:58:44", date: "2026-04-20", time: "23:58:44", device: "ESP32-001", location: "Main Gate",    coInput: 370, coOutput: 182, reduction: 50.8, status: "normal" },
  { id: "R014", timestamp: "2026-04-20 23:55:31", date: "2026-04-20", time: "23:55:31", device: "ESP32-004", location: "Loading Bay",  coInput: 430, coOutput: 211, reduction: 50.9, status: "normal" },
  { id: "R015", timestamp: "2026-04-20 23:52:08", date: "2026-04-20", time: "23:52:08", device: "ESP32-002", location: "Parking Zone", coInput: 490, coOutput: 243, reduction: 50.4, status: "warning" },
  { id: "R016", timestamp: "2026-04-20 18:10:22", date: "2026-04-20", time: "18:10:22", device: "ESP32-001", location: "Main Gate",    coInput: 460, coOutput: 228, reduction: 50.4, status: "warning" },
  { id: "R017", timestamp: "2026-04-20 18:07:55", date: "2026-04-20", time: "18:07:55", device: "ESP32-004", location: "Loading Bay",  coInput: 400, coOutput: 197, reduction: 50.8, status: "normal" },
  { id: "R018", timestamp: "2026-04-20 18:04:33", date: "2026-04-20", time: "18:04:33", device: "ESP32-002", location: "Parking Zone", coInput: 530, coOutput: 262, reduction: 50.6, status: "critical" },
  { id: "R019", timestamp: "2026-04-19 14:22:10", date: "2026-04-19", time: "14:22:10", device: "ESP32-001", location: "Main Gate",    coInput: 350, coOutput: 172, reduction: 50.9, status: "normal" },
  { id: "R020", timestamp: "2026-04-19 14:19:48", date: "2026-04-19", time: "14:19:48", device: "ESP32-004", location: "Loading Bay",  coInput: 420, coOutput: 207, reduction: 50.7, status: "normal" },
];

export const chartData = [
  { date: "Apr 15", avgInput: 420, avgOutput: 207, events: 3 },
  { date: "Apr 16", avgInput: 455, avgOutput: 225, events: 5 },
  { date: "Apr 17", avgInput: 390, avgOutput: 192, events: 2 },
  { date: "Apr 18", avgInput: 480, avgOutput: 238, events: 6 },
  { date: "Apr 19", avgInput: 410, avgOutput: 202, events: 4 },
  { date: "Apr 20", avgInput: 465, avgOutput: 229, events: 7 },
  { date: "Apr 21", avgInput: 450, avgOutput: 222, events: 5 },
];
