import type { PriceItem, PricingCategory } from "@/data/types";
import { formatPrice } from "@/lib/format";

const GROUPS: { category: PricingCategory; label: string }[] = [
  { category: "court", label: "Court time" },
  { category: "lesson", label: "Lessons" },
  { category: "clinic", label: "Clinics" },
  { category: "program", label: "Juniors" },
];

/** Menu-style price list with dotted leaders. Deliberately not a card grid. */
export function PriceList({ items }: { items: PriceItem[] }) {
  return (
    <div className="space-y-8">
      {GROUPS.map((group) => {
        const rows = items.filter((i) => i.category === group.category);
        if (rows.length === 0) return null;
        return (
          <section key={group.category} aria-labelledby={`pricing-${group.category}`}>
            <h3
              id={`pricing-${group.category}`}
              className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-800"
            >
              {group.label}
            </h3>
            <ul className="mt-3 divide-y divide-slate-500/20">
              {rows.map((item) => (
                <li key={item.id} className="py-3.5">
                  {/*
                    Below 400px the name sits on its own line with "price + unit"
                    under it and no dotted leader, so neither has to squeeze the
                    other. From 400px up it is the menu-style row with a leader.
                  */}
                  <p className="flex flex-col min-[400px]:flex-row min-[400px]:items-baseline min-[400px]:gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span
                      aria-hidden="true"
                      className="leader hidden h-[1em] min-w-6 flex-1 text-slate-500/40 min-[400px]:block"
                    />
                    <span className="min-[400px]:whitespace-nowrap min-[400px]:text-right">
                      <span className="font-display text-xl font-medium text-slate-800">
                        {formatPrice(item.price)}
                      </span>
                      <span className="ml-1.5 text-base text-ink-muted">{item.unit}</span>
                    </span>
                  </p>
                  <p className="mt-1 text-base leading-relaxed text-ink-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
