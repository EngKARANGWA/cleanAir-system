import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface StepCardProps {
  step: string;
  label: string;
  desc: string;
  icon: ReactNode;
  isLast?: boolean;
}

export default function StepCard({ step, label, desc, icon, isLast = false }: StepCardProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
      <div className="flex flex-col items-center text-center w-32">
        <div className="mb-2">{icon}</div>
        <div className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full mb-1">
          Step {step}
        </div>
        <p className="font-semibold text-sm text-slate-900 dark:text-white">{label}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{desc}</p>
      </div>
      {!isLast && (
        <ChevronRight className="text-slate-600 w-6 h-6 hidden md:block" />
      )}
    </div>
  );
}
