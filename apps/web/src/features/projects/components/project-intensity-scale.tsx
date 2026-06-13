import { clampPercent } from "./projects-list-style-utils";

export function ProjectIntensityScale({ value }: { value: number }) {
  const marker = clampPercent(value);

  return (
    <div className="pt-3">
      <div
        className="relative h-2.5 rounded-full shadow-inner"
        style={{ background: "linear-gradient(90deg, #16a34a 0%, #eab308 35%, #f97316 62%, #dc2626 100%)" }}
      >
        <span
          className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950 shadow-sm ring-2 ring-white dark:bg-white dark:ring-slate-950"
          style={{ left: `${marker}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="relative h-4">
        <span
          className="absolute top-1 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-slate-700 dark:border-t-slate-200"
          style={{ left: `${marker}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
