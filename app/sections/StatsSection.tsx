import StatCard from "../components/StatCard";

const stats = [
  { value: "50%", label: "CO Reduction", color: "text-green-400" },
  { value: "≤3s", label: "Response Time", color: "text-blue-400" },
  { value: "95%+", label: "Data Reliability", color: "text-purple-400" },
  { value: "1000ppm", label: "Sensor Range", color: "text-yellow-400" },
];

export default function StatsSection() {
  return (
    <section id="stats" className="px-8 py-20 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Expected Impact</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
