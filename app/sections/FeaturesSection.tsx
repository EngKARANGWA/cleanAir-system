import {
  Microscope,
  FlaskConical,
  Radio,
  LayoutDashboard,
  BellRing,
  Cloud,
} from "lucide-react";
import FeatureCard from "../components/FeatureCard";

const features = [
  {
    icon: <Microscope className="w-7 h-7 text-blue-400" />,
    title: "Real-Time CO Detection",
    desc: "MQ-7 gas sensor continuously measures carbon monoxide concentration (0–1000 ppm) at the exhaust level.",
  },
  {
    icon: <FlaskConical className="w-7 h-7 text-purple-400" />,
    title: "Catalytic Conversion",
    desc: "Catalytic converter unit converts toxic CO into CO₂ before release, achieving 40–60% reduction efficiency.",
  },
  {
    icon: <Radio className="w-7 h-7 text-cyan-400" />,
    title: "IoT Data Transmission",
    desc: "ESP32 microcontroller processes and transmits sensor data to the cloud via Wi-Fi every 2–5 seconds.",
  },
  {
    icon: <LayoutDashboard className="w-7 h-7 text-green-400" />,
    title: "Live Dashboard",
    desc: "Web-based dashboard visualizes emission levels, purification status, and historical trends in real time.",
  },
  {
    icon: <BellRing className="w-7 h-7 text-red-400" />,
    title: "Threshold Alerts",
    desc: "Automatic alerts are triggered when CO levels exceed 400 ppm, enabling immediate action.",
  },
  {
    icon: <Cloud className="w-7 h-7 text-sky-400" />,
    title: "Cloud Storage",
    desc: "All sensor readings are stored in the cloud database with ≥95% reliability for historical analysis.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">System Features</h2>
      <p className="text-slate-400 text-center mb-12">
        Everything you need to monitor and reduce CO emissions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
