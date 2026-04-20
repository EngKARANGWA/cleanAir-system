interface StatCardProps {
  value: string;
  label: string;
  color: string;
}

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 text-center shadow-sm dark:shadow-none">
      <p className={`text-3xl md:text-4xl font-extrabold ${color}`}>{value}</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{label}</p>
    </div>
  );
}
