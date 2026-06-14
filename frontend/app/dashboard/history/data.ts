import type { ApiDevice } from "../../../lib/api";

export type ReadingStatus = "normal" | "warning" | "critical";

export interface Reading {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  device: string;
  vehicleName: string;
  type: string;
  plateOrRef: string;
  coInput: number;
  coOutput: number;
  reduction: number;
  status: ReadingStatus;
}

export interface ChartPoint {
  date: string;
  avgInput: number;
  avgOutput: number;
  events: number;
}

const TYPE_LABEL: Record<string, string> = {
  car: "Car", motorcycle: "Motorcycle", industry: "Industry",
  CAR: "Car", MOTORCYCLE: "Motorcycle", INDUSTRY: "Industry",
};

export function mapDeviceToReading(d: ApiDevice, ts: Date): Reading {
  const input     = Math.round((d.coInput  ?? 0) * 100) / 100;
  const output    = Math.round((d.coOutput ?? 0) * 100) / 100;
  const reduction = Math.round(
    (d.reduction ?? (input > 0 ? ((input - output) / input) * 100 : 0)) * 100
  ) / 100;

  let status: ReadingStatus = "normal";
  if (input >= 500) status = "critical";
  else if (input >= 400 || reduction < 45) status = "warning";

  const date = ts.toISOString().slice(0, 10);
  const time = ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return {
    id:          `${d.id}-${ts.getTime()}`,
    timestamp:   `${date} ${time}`,
    date,
    time,
    device:      d.id,
    vehicleName: d.name,
    type:        TYPE_LABEL[d.type] ?? d.type,
    plateOrRef:  d.plateOrRef,
    coInput:     input,
    coOutput:    output,
    reduction,
    status,
  };
}

export function buildChartData(readings: Reading[]): ChartPoint[] {
  const byDate = new Map<string, { inputs: number[]; outputs: number[]; events: number }>();

  for (const r of readings) {
    const slot = byDate.get(r.date) ?? { inputs: [], outputs: [], events: 0 };
    slot.inputs.push(r.coInput);
    slot.outputs.push(r.coOutput);
    if (r.status !== "normal") slot.events++;
    byDate.set(r.date, slot);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, { inputs, outputs, events }]) => ({
      date:      new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      avgInput:  Math.round(inputs.reduce((s, v)  => s + v, 0) / inputs.length),
      avgOutput: Math.round(outputs.reduce((s, v) => s + v, 0) / outputs.length),
      events,
    }));
}
