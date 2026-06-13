import { cn } from "@/lib/utils";

import { clampPercent } from "./projects-list-style-utils";

export function ProjectProgressDonut({
  className,
  label = "RBI Progress",
  size = 74,
  strokeWidth = 7,
  value,
}: {
  className?: string;
  label?: string;
  size?: number;
  strokeWidth?: number;
  value: number;
}) {
  const normalized = clampPercent(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalized / 100) * circumference;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative grid shrink-0 place-items-center" style={{ height: size, width: size }}>
        <svg className="-rotate-90" height={size} viewBox={`0 0 ${size} ${size}`} width={size} aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke="currentColor"
            strokeDasharray="2 6"
            strokeLinecap="round"
            strokeOpacity="0.32"
            strokeWidth={strokeWidth}
            className="text-slate-300 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            className="text-blue-600 dark:text-blue-300"
          />
        </svg>
        <span className="absolute text-sm font-black text-slate-950 dark:text-white">{normalized}%</span>
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  );
}
