"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Eye, EyeOff, Wind } from "lucide-react";

const rand = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };
const STARS = Array.from({ length: 120 }, (_, i) => ({
  big:     rand(i * 4)     < 0.3,
  bigH:    rand(i * 4 + 1) < 0.3,
  top:     rand(i * 4 + 2) * 60,
  left:    rand(i * 4 + 3) * 100,
  opacity: rand(i * 4 + 4) * 0.7 + 0.3,
}));

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0022] via-[#2d0a6e] to-[#6b21a8]" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width:   s.big  ? "2px" : "1px",
              height:  s.bigH ? "2px" : "1px",
              top:     `${s.top}%`,
              left:    `${s.left}%`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouette (back) */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,320 L0,200 L120,100 L240,160 L380,60 L520,140 L660,40 L800,130 L940,50 L1080,140 L1200,80 L1320,150 L1440,90 L1440,320 Z"
          fill="#1e0050"
          opacity="0.9"
        />
        <path
          d="M0,320 L0,240 L80,180 L180,220 L300,150 L440,200 L560,130 L700,190 L820,120 L960,180 L1080,140 L1200,190 L1320,160 L1440,200 L1440,320 Z"
          fill="#2d006b"
          opacity="0.85"
        />
      </svg>

      {/* Tree silhouettes */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140,1200,1260,1320,1380].map((x, i) => {
          const h = 80 + (i % 5) * 20;
          const w = 30 + (i % 3) * 10;
          return (
            <g key={x} transform={`translate(${x}, ${200 - h})`}>
              <polygon points={`${w/2},0 ${w},${h*0.45} 0,${h*0.45}`} fill="#0f0033" opacity="0.95" />
              <polygon points={`${w/2},${h*0.2} ${w*1.1},${h*0.65} ${-w*0.1},${h*0.65}`} fill="#0f0033" opacity="0.95" />
              <polygon points={`${w/2},${h*0.4} ${w*1.2},${h*0.9} ${-w*0.2},${h*0.9}`} fill="#0f0033" opacity="0.95" />
              <rect x={w/2 - 3} y={h*0.85} width="6" height={h*0.15} fill="#0f0033" opacity="0.95" />
            </g>
          );
        })}
      </svg>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/40">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-violet-500 to-purple-700 p-3 rounded-2xl shadow-lg shadow-purple-500/30 mb-3">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Login</h1>
            <p className="text-white/50 text-xs mt-1">CleanAir Monitoring System</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-3.5 h-3.5 accent-violet-500 rounded"
                />
                Remember Me
              </label>
              <Link href="#" className="text-white/60 hover:text-white transition-colors">
                Forgot Password
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-white hover:bg-white/90 text-purple-900 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-black/20 mt-2"
            >
              Login
            </button>
          </form>

          <p className="text-center text-white/50 text-xs mt-6">
            Don&apos;t have an account?{" "}
            <Link href="#" className="text-white font-semibold hover:text-violet-300 transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
