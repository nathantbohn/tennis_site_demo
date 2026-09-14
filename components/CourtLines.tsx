/** Abstract top-down court markings, drawn in chalk white. Decorative. */
export function CourtLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      stroke="#fff"
      strokeWidth="2.5"
    >
      <rect x="40" y="30" width="320" height="200" />
      <line x1="70" y1="30" x2="70" y2="230" />
      <line x1="330" y1="30" x2="330" y2="230" />
      <line x1="70" y1="82" x2="330" y2="82" />
      <line x1="70" y1="178" x2="330" y2="178" />
      <line x1="200" y1="82" x2="200" y2="178" />
      <line x1="40" y1="130" x2="360" y2="130" strokeDasharray="6 5" strokeWidth="3" />
      <line x1="200" y1="30" x2="200" y2="36" />
      <line x1="200" y1="224" x2="200" y2="230" />
    </svg>
  );
}
