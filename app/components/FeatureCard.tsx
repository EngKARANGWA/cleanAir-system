import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 hover:border-blue-500/40 transition-colors shadow-sm dark:shadow-none">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
