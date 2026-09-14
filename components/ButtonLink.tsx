import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none transition-colors duration-150 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-lime-500 text-ink hover:bg-lime-600 active:bg-lime-600",
  secondary:
    "bg-cream-100 text-ink ring-1 ring-inset ring-slate-500/25 hover:bg-aqua-100 active:bg-aqua-200",
  quiet: "bg-transparent text-ink ring-1 ring-inset ring-slate-500/40 hover:bg-sage-100 active:bg-aqua-100",
  /** For buttons that sit directly on a dark surface (the header, footer, dark CTA panels). */
  onDark: "bg-transparent text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 active:bg-white/15",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-[0.9375rem]",
  lg: "min-h-13 px-6 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** For tel:, sms:, mailto: and external links; internal paths use next/link. */
  external?: boolean;
};

export function ButtonLink({ href, children, variant, size, className = "", external }: Props) {
  const cls = buttonClass(variant, size, className);
  const isExternal = external ?? !href.startsWith("/");
  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
