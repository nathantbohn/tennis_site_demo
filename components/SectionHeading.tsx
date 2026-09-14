import type { ReactNode } from "react";
import { Eyebrow } from "@/components/Eyebrow";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, lede, as: Tag = "h2", className = "", id }: Props) {
  const size =
    Tag === "h1"
      ? "text-[2.375rem] sm:text-5xl md:text-[3.5rem]"
      : "text-[1.875rem] sm:text-4xl";
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        id={id}
        className={`font-display soft mt-3 font-medium leading-[1.05] tracking-tight text-court-900 ${size}`}
      >
        {title}
      </Tag>
      {lede ? <p className="mt-4 text-lg leading-relaxed text-ink-muted">{lede}</p> : null}
    </div>
  );
}
