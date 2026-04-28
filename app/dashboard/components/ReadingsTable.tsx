const readings = [
  { id: 1, time: "05:58:12", input: 440, output: 218, reduction: "50.5%", status: "Normal" },
  { id: 2, time: "05:55:09", input: 395, output: 195, reduction: "50.6%", status: "Normal" },
  { id: 3, time: "05:52:41", input: 420, output: 205, reduction: "51.2%", status: "Normal" },
  { id: 4, time: "05:50:03", input: 500, output: 248, reduction: "50.4%", status: "Warning" },
  { id: 5, time: "05:47:28", input: 460, output: 225, reduction: "51.1%", status: "Normal" },
  { id: 6, time: "05:44:55", input: 430, output: 210, reduction: "51.2%", status: "Normal" },
  { id: 7, time: "05:42:11", input: 520, output: 255, reduction: "51.0%", status: "Warning" },
];

const statusStyle: Record<string, string> = {
  Normal:  "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  Warning: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Critical:"bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function ReadingsTable() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Readings</h3>
        <span className="text-xs text-slate-400">Auto-refreshes every 3s</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/40">
              {["Time", "CO Input (ppm)", "After Purification (ppm)", "Reduction", "Status"].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {readings.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-3 font-mono text-slate-500 dark:text-slate-400">{r.time}</td>
                <td className="px-6 py-3 font-semibold text-red-500">{r.input}</td>
                <td className="px-6 py-3 font-semibold text-green-500">{r.output}</td>
                <td className="px-6 py-3 text-slate-700 dark:text-slate-300">{r.reduction}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
