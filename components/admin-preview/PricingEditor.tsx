"use client";

import { useId, useState, type FormEvent } from "react";
import type { PriceItem, PricingCategory } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { useAdminPreview } from "@/lib/admin-preview/store";
import { buttonClass } from "@/components/ButtonLink";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import {
  adminCardClass,
  adminFormCardClass,
  adminIconButtonClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin-preview/adminStyles";

const CATEGORY_LABEL: Record<PricingCategory, string> = {
  pass: "Pass",
  court: "Court time",
  lesson: "Lesson",
  clinic: "Clinic",
  program: "Program",
};

const CATEGORY_ORDER: PricingCategory[] = ["pass", "court", "lesson", "clinic", "program"];

type FormValues = {
  name: string;
  category: PricingCategory;
  price: string;
  unit: string;
  description: string;
  visits: string;
  featured: boolean;
};

function emptyValues(): FormValues {
  return { name: "", category: "court", price: "", unit: "", description: "", visits: "", featured: false };
}

function fromItem(item: PriceItem): FormValues {
  return {
    name: item.name,
    category: item.category,
    price: String(item.price),
    unit: item.unit,
    description: item.description,
    visits: item.visits ? String(item.visits) : "",
    featured: Boolean(item.featured),
  };
}

function validate(values: FormValues): string | null {
  if (!values.name.trim()) return "Enter a name.";
  if (!values.unit.trim()) return "Enter a unit, like \"per hour\".";
  if (!values.description.trim()) return "Enter a short description.";
  const price = Number(values.price);
  if (!Number.isFinite(price) || price < 0) return "Enter a price of 0 or more.";
  return null;
}

function ItemForm({
  title,
  initial,
  onCancel,
  onSubmit,
}: {
  title: string;
  initial: FormValues;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
}) {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(initial);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validate(values);
    if (problem) {
      setError(problem);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className={`${adminFormCardClass} space-y-3`} aria-label={title}>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {error ? (
        <p role="alert" className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-800 ring-1 ring-inset ring-slate-500/30">
          {error}
        </p>
      ) : null}

      <div>
        <label htmlFor={`${uid}-name`} className={adminLabelClass}>
          Name
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          className={`${adminInputClass} mt-1`}
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          placeholder="Private lesson"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${uid}-category`} className={adminLabelClass}>
            Category
          </label>
          <select
            id={`${uid}-category`}
            className={`${adminInputClass} mt-1`}
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value as PricingCategory }))}
          >
            {CATEGORY_ORDER.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABEL[category]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-price`} className={adminLabelClass}>
            Price (USD)
          </label>
          <input
            id={`${uid}-price`}
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            className={`${adminInputClass} mt-1`}
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            placeholder="75"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-unit`} className={adminLabelClass}>
          Unit
        </label>
        <input
          id={`${uid}-unit`}
          type="text"
          className={`${adminInputClass} mt-1`}
          value={values.unit}
          onChange={(e) => setValues((v) => ({ ...v, unit: e.target.value }))}
          placeholder="per hour"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-description`} className={adminLabelClass}>
          Description
        </label>
        <input
          id={`${uid}-description`}
          type="text"
          className={`${adminInputClass} mt-1`}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="One-on-one with Fred. Court time and balls included."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${uid}-visits`} className={adminLabelClass}>
            Visits (optional)
          </label>
          <input
            id={`${uid}-visits`}
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            className={`${adminInputClass} mt-1`}
            value={values.visits}
            onChange={(e) => setValues((v) => ({ ...v, visits: e.target.value }))}
            placeholder="5"
          />
        </div>
        <label htmlFor={`${uid}-featured`} className="flex items-center gap-2 self-end pb-2.5">
          <input
            id={`${uid}-featured`}
            type="checkbox"
            className="h-5 w-5 rounded border-slate-500/40 text-slate-800 focus:ring-slate-800/25"
            checked={values.featured}
            onChange={(e) => setValues((v) => ({ ...v, featured: e.target.checked }))}
          />
          <span className="text-sm font-medium">Featured</span>
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className={buttonClass("primary", "md", "flex-1")}>
          Save
        </button>
        <button type="button" onClick={onCancel} className={buttonClass("quiet", "md", "flex-1")}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Add/edit/delete price list items, grouped by category. */
export function PricingEditor() {
  const { pricing, addPriceItem, updatePriceItem, deletePriceItem } = useAdminPreview();
  const [editing, setEditing] = useState<"new" | string | null>(null);

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: pricing.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0 || editing === "new");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display soft text-2xl font-medium text-slate-800">Pricing</h1>
          <p className="mt-1 text-sm text-ink-muted">Add, edit or remove price list items.</p>
        </div>
        {editing === null ? (
          <button type="button" onClick={() => setEditing("new")} className={buttonClass("primary", "md", "shrink-0")}>
            <PlusIcon />
            Add
          </button>
        ) : null}
      </div>

      {editing === "new" ? (
        <ItemForm
          title="New price item"
          initial={emptyValues()}
          onCancel={() => setEditing(null)}
          onSubmit={(values) => {
            addPriceItem({
              name: values.name.trim(),
              category: values.category,
              price: Math.round(Number(values.price)),
              unit: values.unit.trim(),
              description: values.description.trim(),
              visits: values.visits.trim() ? Number(values.visits) : undefined,
              featured: values.featured || undefined,
            });
            setEditing(null);
          }}
        />
      ) : null}

      {pricing.length === 0 && editing !== "new" ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-ink-muted ring-1 ring-slate-500/15">
          No price items yet. Tap Add to create one.
        </p>
      ) : null}

      {groups.map((group) => (
        <section key={group.category} aria-labelledby={`category-${group.category}`}>
          <h2
            id={`category-${group.category}`}
            className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-800"
          >
            {CATEGORY_LABEL[group.category]}
          </h2>
          <div className="mt-2 space-y-2">
            {group.items.map((item) =>
              editing === item.id ? (
                <ItemForm
                  key={item.id}
                  title="Edit price item"
                  initial={fromItem(item)}
                  onCancel={() => setEditing(null)}
                  onSubmit={(values) => {
                    updatePriceItem(item.id, {
                      name: values.name.trim(),
                      category: values.category,
                      price: Math.round(Number(values.price)),
                      unit: values.unit.trim(),
                      description: values.description.trim(),
                      visits: values.visits.trim() ? Number(values.visits) : undefined,
                      featured: values.featured || undefined,
                    });
                    setEditing(null);
                  }}
                />
              ) : (
                <article key={item.id} className={adminCardClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-base font-medium">{item.name}</span>
                        {item.featured ? (
                          <span className="rounded-full bg-lime-500 px-2 py-0.5 text-xs font-semibold text-ink">
                            Featured
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm">
                        <span className="font-display font-medium text-slate-800">{formatPrice(item.price)}</span>{" "}
                        <span className="text-ink-muted">{item.unit}</span>
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(item.id)}
                        aria-label={`Edit ${item.name}`}
                        className={adminIconButtonClass}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePriceItem(item.id)}
                        aria-label={`Delete ${item.name}`}
                        className={adminIconButtonClass}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
