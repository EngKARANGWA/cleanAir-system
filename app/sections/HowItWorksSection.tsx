import { Wind, FlaskConical, Microscope, Cpu, LayoutDashboard } from "lucide-react";
import StepCard from "../components/StepCard";

const steps = [
  {
    step: "1",
    label: "Exhaust Gas",
    desc: "Raw CO-rich gas enters the system",
    icon: <Wind className="w-8 h-8 text-slate-300" />,
  },
  {
    step: "2",
    label: "Catalytic Unit",
    desc: "CO is converted to CO₂",
    icon: <FlaskConical className="w-8 h-8 text-purple-400" />,
  },
  {
    step: "3",
    label: "MQ-7 Sensor",
    desc: "CO levels measured in ppm",
    icon: <Microscope className="w-8 h-8 text-blue-400" />,
  },
  {
    step: "4",
    label: "ESP32",
    desc: "Data processed & sent to cloud",
    icon: <Cpu className="w-8 h-8 text-cyan-400" />,
  },
  {
    step: "5",
    label: "Dashboard",
    desc: "Live monitoring & alerts",
    icon: <LayoutDashboard className="w-8 h-8 text-green-400" />,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-8 py-20 bg-slate-100 dark:bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-white">How It Works</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-12">
          From exhaust pipe to clean air in seconds
        </p>
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          {steps.map((s, i) => (
            <StepCard key={s.step} {...s} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
