"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Eye, EyeOff, Wind } from "lucide-react";
import Modal from "./Modal";

const rand = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };
const STARS = Array.from({ length: 60 }, (_, i) => ({
  big:     rand(i * 4)     < 0.3,
  bigH:    rand(i * 4 + 1) < 0.3,
  top:     rand(i * 4 + 2) * 55,
  left:    rand(i * 4 + 3) * 100,
  opacity: rand(i * 4 + 4) * 0.7 + 0.3,
}));

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <Modal open={open} onClose={onClose}>
      {/* Sky gradient background on card */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0022] via-[#2d0a6e] to-[#6b21a8]" />

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
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

        {/* Mountain silhouette */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,120 L0,70 L40,30 L80,55 L130,15 L180,50 L230,10 L280,45 L330,20 L380,50 L400,35 L400,120 Z"
            fill="#1e0050"
            opacity="0.9"
          />
          <path
            d="M0,120 L0,90 L30,65 L70,82 L110,55 L160,75 L210,48 L260,70 L310,55 L360,72 L400,60 L400,120 Z"
            fill="#2d006b"
            opacity="0.85"
          />
        </svg>

        {/* Trees */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[0,22,44,66,88,110,132,154,176,198,220,242,264,286,308,330,352,374].map((x, i) => {
            const h = 35 + (i % 4) * 10;
            const w = 14 + (i % 3) * 4;
            return (
              <g key={x} transform={`translate(${x}, ${80 - h})`}>
                <polygon points={`${w/2},0 ${w},${h*0.4} 0,${h*0.4}`}          fill="#0f0033" opacity="0.95" />
                <polygon points={`${w/2},${h*0.2} ${w*1.1},${h*0.62} ${-w*0.1},${h*0.62}`} fill="#0f0033" opacity="0.95" />
                <polygon points={`${w/2},${h*0.4} ${w*1.2},${h*0.88} ${-w*0.2},${h*0.88}`} fill="#0f0033" opacity="0.95" />
                <rect x={w/2-2} y={h*0.85} width="4" height={h*0.15} fill="#0f0033" opacity="0.95" />
              </g>
            );
          })}
        </svg>

        {/* Glass form */}
        <div className="relative z-10 px-8 pt-8 pb-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
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
    </Modal>
  );
}
