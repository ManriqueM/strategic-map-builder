import type { InitiativeProgress } from "../types";

const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconShape({ progress }: { progress: InitiativeProgress }) {
  switch (progress) {
    case "none":
      return <rect x="2.5" y="2.5" width="7" height="7" rx="1.2" {...STROKE_PROPS} />;
    case "not-on-track":
      return <path d="M3 3 L9 9 M9 3 L3 9" {...STROKE_PROPS} />;
    case "on-track":
      return (
        <>
          <circle cx="6" cy="4.3" r="2.8" {...STROKE_PROPS} />
          <path d="M4.5 7.4 L7.5 7.4 M5 8.7 L7 8.7" {...STROKE_PROPS} />
        </>
      );
    case "complete":
      return <path d="M2.5 6.5 L5 9 L9.5 3" {...STROKE_PROPS} />;
  }
}

export function InitiativeProgressIcon({ progress }: { progress: InitiativeProgress }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <IconShape progress={progress} />
    </svg>
  );
}
