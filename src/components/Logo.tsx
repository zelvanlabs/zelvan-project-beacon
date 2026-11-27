import { useId } from "react";

export function Logo({ zColor = "var(--ink)", size = 32, className }: { zColor?: string; size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const clip = `top-${id}`;
  return (
    <svg viewBox="0 0 110 80" fill="none" width={size * 1.375} height={size} className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="11.5" width="110" height="60" />
        </clipPath>
      </defs>
      <path d="M14 16H38L14 64H38" stroke={zColor} strokeWidth="9" strokeLinejoin="bevel" />
      <g clipPath={`url(#${clip})`}>
        <path d="M44.75 8L74 66.5L103.25 8" stroke="#F2A33A" strokeWidth="9" strokeLinejoin="bevel" />
      </g>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} style={{ letterSpacing: "-0.01em" }}>
      <span className="font-bold">zelvan</span>
      <span className="font-normal">labs</span>
    </span>
  );
}
