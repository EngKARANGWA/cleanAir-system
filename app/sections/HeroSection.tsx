"use client";

import Link from "next/link";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-8">

      <button
        type="button"
        onClick={() => setDark((d) => !d)}
        className="absolute top-6 right-6 p-2 rounded-full border border-white/20 hover:border-white/40 text-white transition-colors"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl">
        Breathe Cleaner Air with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Smart Purification
        </span>
      </h1>

      <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
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
          className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
        >
          Learn How It Works
        </a>
      </div>

      {/* Live CO reading demo card */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">CO Level (Input)</p>
          <p className="text-4xl font-bold text-red-400">
            420 <span className="text-lg font-normal text-slate-400">ppm</span>
          </p>
        </div>
        <ChevronRight className="text-slate-500 w-8 h-8" />
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">After Purification</p>
          <p className="text-4xl font-bold text-green-400">
            210 <span className="text-lg font-normal text-slate-400">ppm</span>
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-3 py-1 rounded-full">
          50% Reduction
        </div>
      </div>
    </section>
  );
}
