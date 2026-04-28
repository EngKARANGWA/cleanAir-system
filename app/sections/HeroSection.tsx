import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-8">

      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl text-slate-900 dark:text-white">
        Breathe Cleaner Air with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          Smart Purification
        </span>
      </h1>

      <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
        An IoT-based exhaust air purification and monitoring system that reduces
        carbon monoxide emissions from vehicles and industries in real time.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          View Live Dashboard
        </Link>
        <a
          href="#how-it-works"
          className="border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 text-slate-700 dark:text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
        >
          Learn How It Works
        </a>
      </div>

      {/* Live CO reading demo card */}
      <div className="mt-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 backdrop-blur-sm shadow-sm dark:shadow-none">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest mb-1">CO Level (Input)</p>
          <p className="text-4xl font-bold text-red-400">
            420 <span className="text-lg font-normal text-slate-500 dark:text-slate-400">ppm</span>
          </p>
        </div>
        <ChevronRight className="text-slate-500 w-8 h-8" />
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest mb-1">After Purification</p>
          <p className="text-4xl font-bold text-green-400">
            210 <span className="text-lg font-normal text-slate-500 dark:text-slate-400">ppm</span>
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-3 py-1 rounded-full">
          50% Reduction
        </div>
      </div>
    </section>
  );
}
