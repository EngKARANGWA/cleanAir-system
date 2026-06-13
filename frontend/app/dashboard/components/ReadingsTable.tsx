import type { Device } from "../devices/data";

const statusStyle: Record<string, string> = {
  Normal:   "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  Warning:  "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Critical: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
  Offline:  "bg-slate-50 dark:bg-slate-700 text-slate-400",
};

function deviceStatus(d: Device) {
  if (d.status === "offline") return "Offline";
  if (d.coInput >= 500)       return "Critical";
  if (d.coInput >= 400)       return "Warning";
  return "Normal";
}

export default function ReadingsTable({ devices }: { devices: Device[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Readings</h3>
        <span className="text-xs text-slate-400">Latest per device</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/40">
              {["Device", "CO Input (ppm)", "After Purification (ppm)", "Reduction", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {devices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  Loading device data…
                </td>
              </tr>
            ) : (
              devices.map((d) => {
                const status = deviceStatus(d);
                return (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{d.name}</td>
                    <td className="px-6 py-3 font-semibold text-red-500">
                      {d.coInput > 0 ? d.coInput : "—"}
                    </td>
                    <td className="px-6 py-3 font-semibold text-green-500">
                      {d.coOutput > 0 ? d.coOutput : "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-700 dark:text-slate-300">
                      {d.reduction > 0 ? `${d.reduction}%` : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[status]}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
