import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none transition-colors duration-150 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-clay-700 text-white hover:bg-clay-800 active:bg-clay-800",
  secondary: "bg-court-100 text-court-800 hover:bg-court-200 active:bg-court-200",
  quiet: "bg-transparent text-ink ring-1 ring-inset ring-ink/15 hover:bg-sand-100 active:bg-sand-200",
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
