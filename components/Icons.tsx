/** Tiny inline icon set. All decorative; pair with visible text. */
type IconProps = { className?: string };

const common = {
  "aria-hidden": true as const,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function PhoneIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function MessageIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function PinIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="m5 12 4 4L19 7" />
    </svg>
  );
}

export function ExternalIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M14 5h5v5M19 5l-8 8M19 14v5H5V5h5" />
    </svg>
  );
}

/**
 * A tennis ball, drawn to match the favicon (app/icon.svg). Used for the
 * ACE PASS visit dots — the club's logo (public/logo.png) carries the
 * wordmark everywhere else.
 */
export function BallMark({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="15" fill="#7c9518" />
      <path
        d="M7 4.5c6 4 6 19 0 23M25 4.5c-6 4-6 19 0 23"
        fill="none"
        stroke="#10161a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
