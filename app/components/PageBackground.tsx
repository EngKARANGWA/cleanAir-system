const rand = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };
const STARS = Array.from({ length: 120 }, (_, i) => ({
  big:     rand(i * 4)     < 0.3,
  top:     rand(i * 4 + 2) * 60,
  left:    rand(i * 4 + 3) * 100,
  opacity: rand(i * 4 + 4) * 0.7 + 0.3,
}));

export default function PageBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-violet-100 via-purple-50 to-indigo-100 dark:from-[#0d0022] dark:via-[#2d0a6e] dark:to-[#6b21a8] transition-colors duration-300" />
      <svg suppressHydrationWarning className="fixed inset-0 -z-10 w-full h-full pointer-events-none hidden dark:block" xmlns="http://www.w3.org/2000/svg">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.left}%`} cy={`${s.top}%`} r={s.big ? 1 : 0.5} fill="white" opacity={s.opacity} />
        ))}
      </svg>
      <svg className="fixed bottom-0 left-0 right-0 -z-10 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,320 L0,200 L120,100 L240,160 L380,60 L520,140 L660,40 L800,130 L940,50 L1080,140 L1200,80 L1320,150 L1440,90 L1440,320 Z" className="fill-violet-200 dark:fill-[#1e0050]" opacity="0.9" />
        <path d="M0,320 L0,240 L80,180 L180,220 L300,150 L440,200 L560,130 L700,190 L820,120 L960,180 L1080,140 L1200,190 L1320,160 L1440,200 L1440,320 Z" className="fill-purple-200 dark:fill-[#2d006b]" opacity="0.85" />
      </svg>
    </>
  );
}
