import Link from "next/link";
import {
  Activity,
  Archive,
  ClipboardCheck,
  Database,
  FileText,
  Gauge,
  HardHat,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const modules = [
  {
    title: "Dashboard",
    description: "Portfolio view for asset health, risk exposure, inspection due, certification due, and open actions.",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects & Data Intake",
    description: "Project onboarding, document upload, data extraction, completeness review, RFI, validation, and handover.",
    href: "/projects",
    icon: Archive,
  },
  {
    title: "Asset Registry",
    description: "Validated asset master data, datasheets, operating data, CML/TML, documents, certification, and change log.",
    href: "/assets",
    icon: Database,
  },
  {
    title: "Integrity & RBI",
    description: "API 580/API 581 RBI workflow, risk register, risk analytics, DMR, PoF, CoF, inspection plan, and revalidation.",
    href: "/integrity-rbi",
    icon: Gauge,
  },
  {
    title: "Inspection Management",
    description: "Inspection plan, schedule, workpack, execution, findings, and historical inspection records.",
    href: "/inspections",
    icon: HardHat,
  },
  {
    title: "Anomalies & Actions",
    description: "Anomaly register, recommendations, corrective actions, close-out, and engineering-triggered actions.",
    href: "/anomalies-actions/anomalies",
    icon: Wrench,
  },
  {
    title: "Compliance & Certification",
    description: "Certification register, regulatory matrix, renewal tracker, evidence pack, and submission log.",
    href: "/compliance-certification",
    icon: ShieldCheck,
  },
  {
    title: "Documents & Reports",
    description: "Document center, report center, evidence pack builder, transmittal log, templates, and archive.",
    href: "/documents-reports/documents",
    icon: FileText,
  },
  {
    title: "Helpdesk",
    description: "Ticketing, SLA dashboard, support workflow, knowledge base, and service request tracking.",
    href: "/helpdesk",
    icon: HelpCircle,
  },
  {
    title: "Administration",
    description: "User management, roles, taxonomy, risk matrix, methodology, regulatory library, workflows, and audit trail.",
    href: "/administration",
    icon: ClipboardCheck,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                <Activity className="h-4 w-4" />
                SUCOFINDO AEBT Asset Integrity Digital Platform
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950">
                Asset Integrity Management Platform berbasis Asset Registry, RBI, Inspection, Compliance, dan Certification
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Initial web shell untuk platform AIM-RBI. Halaman ini menjadi main page sementara sebelum modul dashboard, asset registry, RBI workspace, inspection management, compliance, dan administration dikembangkan secara penuh.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 lg:block">
              <div className="font-semibold text-slate-900">Stack</div>
              <div className="mt-2 space-y-1">
                <div>Next.js + TypeScript</div>
                <div>Tailwind CSS</div>
                <div>shadcn/ui-ready</div>
                <div>NestJS + FastAPI</div>
                <div>PostgreSQL + TimescaleDB</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Enter Platform
            </Link>
            <Link
              href="/assets"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Open Asset Registry
            </Link>
            <Link
              href="/integrity-rbi"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Open RBI Module
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                href={module.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-950 group-hover:text-slate-700">
                      {module.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {module.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
