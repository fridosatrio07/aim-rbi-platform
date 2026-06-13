import { DenseSection } from "@/components/data-display/compact-primitives";

export function StandardMetadataForm() {
  return (
    <DenseSection title="Standard Metadata" eyebrow="Required registration fields">
      <div className="grid gap-3 lg:grid-cols-3">
        {[
          ["Standard Code", "API 580"],
          ["Title", "Risk-Based Inspection methodology metadata placeholder"],
          ["Publisher", "API / ISO / ASME / ESDM"],
          ["Edition / Year", "2021 / current edition"],
          ["Effective Date", "YYYY-MM-DD"],
          ["Owner", "SUCOFINDO AEBT / client"],
        ].map(([label, placeholder]) => (
          <label key={label} className="block">
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              placeholder={placeholder}
            />
          </label>
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {[
          ["Industry", "oil_gas, geothermal"],
          ["Equipment Applicability", "pressure_vessel, piping"],
          ["Analysis Applicability", "RBI, PLO_readiness"],
        ].map(([label, placeholder]) => (
          <label key={label} className="block">
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <textarea
              className="min-h-[76px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              placeholder={placeholder}
            />
          </label>
        ))}
      </div>
    </DenseSection>
  );
}
