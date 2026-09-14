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
              className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700"
            >
              {group.label}
            </h3>
            <ul className="mt-3 divide-y divide-sand-200">
              {rows.map((item) => (
                <li key={item.id} className="py-3.5">
                  <p className="flex items-baseline gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span aria-hidden="true" className="leader h-[1em] min-w-6 flex-1 text-sand-300" />
                    <span className="whitespace-nowrap text-right">
                      <span className="font-display text-xl font-medium text-court-900">
                        {formatPrice(item.price)}
                      </span>
                      <span className="ml-1.5 text-xs text-ink-muted">{item.unit}</span>
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
