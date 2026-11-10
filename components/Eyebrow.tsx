import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-sm font-semibold uppercase tracking-[0.16em] text-slate-800 ${className}`}>
      {children}
    </p>
  );
}
