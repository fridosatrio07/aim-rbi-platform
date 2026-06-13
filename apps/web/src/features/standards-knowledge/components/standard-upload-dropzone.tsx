import { AlertTriangle, UploadCloud } from "lucide-react";

import { DenseSection, StatusBadge } from "@/components/data-display/compact-primitives";

export function StandardUploadDropzone() {
  return (
    <DenseSection
      title="Private Document Upload"
      eyebrow="Superadmin/admin only"
      action={<StatusBadge label="Private runtime storage" tone="blue" />}
    >
      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-5 text-center dark:border-blue-500/30 dark:bg-blue-500/10">
        <UploadCloud className="mx-auto h-8 w-8 text-blue-700 dark:text-blue-300" aria-hidden="true" />
        <p className="mt-2 text-sm font-black text-slate-950 dark:text-white">Drop PDF/DOCX here or register metadata first</p>
        <p className="mx-auto mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          Uploaded standards are stored outside public routes. Parsed text, chunks, tables, formulas, and embeddings are ignored by Git.
        </p>
      </div>
      <div className="mt-3 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-orange-800 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-100">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="text-sm font-bold leading-6">
          Copyright warning: upload only documents the organization is licensed or authorized to access. Do not commit ISO/API/ASME/NACE/AMPP/IEC source files, extracted text, chunks, or embeddings.
        </p>
      </div>
    </DenseSection>
  );
}
