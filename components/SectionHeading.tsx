import type { ReactNode } from "react";
import { Eyebrow } from "@/components/Eyebrow";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
  /**
   * "accent" renders the title in the club's dark red instead of the usual
   * dark blue-gray. Reserved for exactly one heading on the site (see
   * app/page.tsx) — the brand's dark red is used sparingly, not spread
   * across every heading.
   */
  tone?: "default" | "accent";
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
  className = "",
  id,
  tone = "default",
}: Props) {
  const size =
    Tag === "h1"
      ? "text-[2.375rem] sm:text-5xl md:text-[3.5rem]"
      : "text-[1.875rem] sm:text-4xl";
  const titleColor = tone === "accent" ? "text-red-700" : "text-slate-800";
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        id={id}
        className={`font-display soft mt-3 font-medium leading-[1.05] tracking-tight ${titleColor} ${size}`}
      >
        {title}
      </Tag>
      {lede ? <p className="mt-4 text-lg leading-relaxed text-ink-muted">{lede}</p> : null}
    </div>
  );
}
