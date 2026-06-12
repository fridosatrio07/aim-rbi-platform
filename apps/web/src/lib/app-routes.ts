export const APP_ROUTES = {
  dashboard: "/dashboard",
  assets: {
    register: "/assets",
    import: "/assets/import",
  },
  inspections: {
    overview: "/inspections",
    plan: "/inspections/plan",
    schedule: "/inspections/schedule",
    findings: "/inspections/findings",
    history: "/inspections/history",
  },
  anomalies: {
    register: "/anomalies-actions/anomalies",
    recommendations: "/anomalies-actions/recommendations",
    actionTracker: "/anomalies-actions/action-tracker",
    closeOut: "/anomalies-actions/close-out",
  },
  certification: {
    register: "/compliance-certification/certification-register",
    renewals: "/compliance-certification/renewal-tracker",
    evidencePack: "/compliance-certification/evidence-pack",
  },
  rbi: {
    assessments: "/integrity-rbi/assessments",
    riskRegister: "/integrity-rbi/risk-register",
    riskAnalytics: "/integrity-rbi/risk-analytics",
  },
  documents: {
    register: "/documents-reports/documents",
    reports: "/documents-reports/reports",
    evidenceBuilder: "/documents-reports/evidence-pack-builder",
  },
  governance: {
    auditTrail: "/administration/audit-trail",
    regulatoryLibrary: "/administration/regulatory-standard-library",
  },
} as const;
