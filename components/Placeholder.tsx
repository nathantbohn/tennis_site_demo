import type { PlaceholderImage } from "@/data/types";
import { CourtLines } from "@/components/CourtLines";

const variantClass: Record<PlaceholderImage["variant"], string> = {
  clay: "ph-clay",
  dusk: "ph-dusk",
  grass: "ph-grass",
  clubhouse: "ph-clubhouse",
  ball: "ph-ball",
  map: "ph-map",
};

const linesOpacity: Record<PlaceholderImage["variant"], string> = {
  clay: "opacity-80",
  dusk: "opacity-40",
  grass: "opacity-70",
  clubhouse: "opacity-0",
  ball: "opacity-50",
  map: "opacity-0",
};

/** A clay pin over the map grid. Decorative. */
function MapPin() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 60"
      className="absolute left-1/2 top-1/2 h-16 w-auto -translate-x-1/2 -translate-y-[85%] drop-shadow-md"
    >
      <path d="M24 58S4 34 4 21a20 20 0 0 1 40 0c0 13-20 37-20 37Z" fill="#b4532a" />
      <circle cx="24" cy="21" r="8" fill="#fbf7f0" />
    </svg>
  );
}

type Props = {
  image: PlaceholderImage;
  className?: string;
  /** Show the small "photo to come" note (or custom text). On by default for the demo. */
  note?: boolean | string;
};

/**
 * Stands in for a photograph. Reads as an image to assistive tech via the
 * alt text; the visible note tells the owner which shot goes here.
 */
export function Placeholder({ image, className = "", note = true }: Props) {
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={`relative isolate overflow-hidden ${variantClass[image.variant]} ${className}`}
    >
      <CourtLines className={`absolute inset-0 h-full w-full ${linesOpacity[image.variant]}`} />
      {image.variant === "map" ? <MapPin /> : null}
      {note ? (
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-ink/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm"
        >
          {typeof note === "string" ? note : `Photo to come · ${image.alt}`}
        </span>
      ) : null}
    </div>
  );
}
