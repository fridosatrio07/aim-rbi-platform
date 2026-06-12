import { APP_ROUTES } from "@/lib/app-routes";

import type { AssessmentDetailRiskLevel, RbiAssessmentDetailData } from "./assessment-detail-types";

const ASSESSMENT_ID = "RBI-2026-V101";
const ASSESSMENT_ROUTE_ID = ASSESSMENT_ID.toLowerCase();
const ASSESSMENT_BASE_ROUTE = `${APP_ROUTES.rbi.assessments}/${ASSESSMENT_ROUTE_ID}`;

function stepRoute(step: string) {
  return `${ASSESSMENT_BASE_ROUTE}/${step}`;
}

function assetRoute(assetId: string) {
  return `${APP_ROUTES.assets.register}/${assetId.toLowerCase()}`;
}

function withQuery(path: string, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `${path}?${query.toString()}`;
}

function riskLabel(probability: number, consequence: number): AssessmentDetailRiskLevel {
  const score = probability * consequence;

  if (score >= 20) return "Extreme";
  if (score >= 15) return "High";
  if (score >= 10) return "Medium-High";
  if (score >= 5) return "Medium";
  return "Low";
}

export const RBI_ASSESSMENT_DETAIL_DATA: RbiAssessmentDetailData = {
  summary: {
    assessmentId: ASSESSMENT_ID,
    assetTag: "V-101",
    assetName: "V-101 Inlet Separator",
    assetClass: "Pressure Vessel",
    service: "Three-phase inlet separation / wet crude and associated gas",
    locationArea: "North Block Gathering Station / Process Area A",
    assessmentType: "Baseline RBI",
    methodologyLabels: [
      "API 580-style RBI",
      "API 581-style RBI Analytics",
      "API 510-style Pressure Vessel Inspection",
    ],
    status: "In Review",
    leadOwner: "SUCOFINDO RBI Team",
    lastUpdated: "10 Juni 2026",
    nextReviewTarget: "25 Juni 2026",
    facilityName: "SPM-01 Instalasi Stasiun Pengumpul Minyak - North Block Gathering Station",
    facilityType: "Upstream oil and gas gathering station",
    projectOwner: "SUCOFINDO - Asset Integrity & RBI Services",
  },
  kpis: [
    {
      id: "overall-risk",
      label: "Overall Risk",
      value: "Medium-High",
      marker: "Current RBI category",
      tone: "orange",
    },
    {
      id: "pof",
      label: "Probability of Failure",
      value: "3.4 / 5",
      marker: "Driven by thinning and CUI uncertainty",
      tone: "blue",
    },
    {
      id: "cof",
      label: "Consequence of Failure",
      value: "4.1 / 5",
      marker: "Wet crude / gas service consequence",
      tone: "red",
    },
    {
      id: "rank",
      label: "Calculated Risk Rank",
      value: "15 / 142",
      marker: "Portfolio rank",
      tone: "violet",
    },
    {
      id: "inspection-effectiveness",
      label: "Inspection Effectiveness",
      value: "Medium",
      marker: "UT mapping pending validation",
      tone: "cyan",
    },
    {
      id: "comments",
      label: "Open Review Comments",
      value: "6",
      marker: "2 RFIs unresolved",
      tone: "slate",
    },
  ],
  workflowSteps: [
    {
      id: "assessment-basis",
      label: "Assessment Basis",
      shortLabel: "Basis",
      status: "completed",
      completeness: 100,
      disciplines: ["RBI Engineer", "Document Controller"],
      requiredEvidenceCount: 6,
      linkedComments: 0,
      linkedRfis: 0,
      href: stepRoute("assessment-basis"),
    },
    {
      id: "asset-operating-info",
      label: "Asset Operating Info",
      shortLabel: "Operating Info",
      status: "completed",
      completeness: 100,
      disciplines: ["Process Engineer", "Inspection Lead"],
      requiredEvidenceCount: 8,
      linkedComments: 1,
      linkedRfis: 0,
      href: stepRoute("asset-operating-info"),
    },
    {
      id: "damage-mechanism-review",
      label: "Damage Mechanism Review",
      shortLabel: "DMR",
      status: "current",
      completeness: 68,
      disciplines: ["Corrosion Engineer", "Mechanical Engineer", "RBI Engineer"],
      requiredEvidenceCount: 12,
      linkedComments: 4,
      linkedRfis: 2,
      href: stepRoute("damage-mechanism-review"),
    },
    {
      id: "pof-evaluation",
      label: "PoF Evaluation",
      shortLabel: "PoF",
      status: "pending",
      completeness: 38,
      disciplines: ["RBI Engineer", "Corrosion Engineer"],
      requiredEvidenceCount: 9,
      linkedComments: 1,
      linkedRfis: 0,
      href: stepRoute("pof-evaluation"),
    },
    {
      id: "cof-evaluation",
      label: "CoF Evaluation",
      shortLabel: "CoF",
      status: "pending",
      completeness: 34,
      disciplines: ["Process Engineer", "Technical Authority"],
      requiredEvidenceCount: 7,
      linkedComments: 0,
      linkedRfis: 0,
      href: stepRoute("cof-evaluation"),
    },
    {
      id: "risk-target",
      label: "Risk Target",
      shortLabel: "Target",
      status: "pending",
      completeness: 25,
      disciplines: ["RBI Engineer", "Technical Authority"],
      requiredEvidenceCount: 4,
      linkedComments: 0,
      linkedRfis: 0,
      href: stepRoute("risk-target"),
    },
    {
      id: "inspection-mitigation-plan",
      label: "Inspection & Mitigation Plan",
      shortLabel: "Plan",
      status: "pending",
      completeness: 18,
      disciplines: ["Inspection Lead", "Corrosion Engineer", "Operations"],
      requiredEvidenceCount: 10,
      linkedComments: 0,
      linkedRfis: 0,
      href: stepRoute("inspection-mitigation-plan"),
    },
    {
      id: "review-acceptance",
      label: "Review & Acceptance",
      shortLabel: "Acceptance",
      status: "pending",
      completeness: 12,
      disciplines: ["Technical Authority", "SUCOFINDO Governance"],
      requiredEvidenceCount: 5,
      linkedComments: 0,
      linkedRfis: 0,
      href: stepRoute("review-acceptance"),
    },
  ],
  stepPreviews: [
    {
      stepId: "assessment-basis",
      title: "Assessment Basis",
      statusText: "Completed baseline setup",
      narrative:
        "Scope, assessment boundary, methodology labels, and required document set are locked for the current baseline RBI cycle.",
      metrics: [
        { label: "Scope items", value: "11", tone: "blue" },
        { label: "Required documents", value: "6 / 6", tone: "emerald" },
        { label: "Excluded components", value: "2", tone: "slate" },
      ],
      bullets: [
        "Assessment boundary includes vessel shell, heads, nozzles, supports, linked PSV, SDV, and crude inlet/outlet interfaces.",
        "Methodology labels prepared as API 580-style RBI, API 581-style RBI Analytics, and API 510-style Pressure Vessel Inspection.",
        "External coating and insulation zones included because CUI evidence is incomplete around nozzles N2/N3.",
      ],
      actions: [
        { label: "Open Basis Step", href: stepRoute("assessment-basis") },
        { label: "View Methodology", href: APP_ROUTES.rbi.methodologyGovernance },
      ],
    },
    {
      stepId: "asset-operating-info",
      title: "Asset Operating Info",
      statusText: "Operating envelope confirmed",
      narrative:
        "Operating pressure, temperature, fluid composition, and integrity operating window triggers are populated from the current campaign data room.",
      metrics: [
        { label: "Operating pressure", value: "165 psig", tone: "blue" },
        { label: "Operating temp.", value: "68°C", tone: "cyan" },
        { label: "IOW triggers", value: "4 active", tone: "orange" },
      ],
      bullets: [
        "Wet crude / gas / water service with intermittent water accumulation in low-point zones.",
        "CO2 corrosion screening remains active; H2S confirmation is under client clarification.",
        "Water cut and produced-water carryover history are linked as supporting context for under-deposit corrosion review.",
      ],
      actions: [
        { label: "Open Operating Info", href: stepRoute("asset-operating-info") },
        { label: "View IOW / MOC", href: APP_ROUTES.rbi.iowMocTriggers },
      ],
    },
    {
      stepId: "damage-mechanism-review",
      title: "Damage Mechanism Screening & Review",
      statusText: "Current active engineering review",
      narrative:
        "Credible damage mechanisms are screened against inspection evidence, process chemistry, operating envelope, and linked document quality.",
      metrics: [
        { label: "Applicable mechanisms", value: "4", tone: "orange" },
        { label: "Clarifications", value: "2", tone: "red" },
        { label: "Evidence coverage", value: "81%", tone: "cyan" },
      ],
      bullets: [
        "CUI and under-deposit corrosion are the strongest current drivers because evidence is incomplete at nozzle and low-point areas.",
        "H2S susceptibility and PSV set-pressure documentation require formal clarification before PoF/CoF approval.",
        "Reviewer focus is on UT mapping validation, CML/TML trend quality, and linked PSV package completeness.",
      ],
      actions: [
        { label: "Open DMR Step", href: stepRoute("damage-mechanism-review") },
        { label: "Open Risk Register", href: APP_ROUTES.rbi.riskRegister },
      ],
    },
    {
      stepId: "pof-evaluation",
      title: "PoF Evaluation",
      statusText: "Pending final damage factor basis",
      narrative:
        "Preliminary PoF score is available, but the final damage factor basis depends on DMR closure and inspection evidence validation.",
      metrics: [
        { label: "Preliminary PoF", value: "3.4 / 5", tone: "blue" },
        { label: "Uncertainty flags", value: "3", tone: "orange" },
        { label: "Inspection effectiveness", value: "Medium", tone: "cyan" },
      ],
      bullets: [
        "Damage factor summary references thinning, CUI uncertainty, and intermittent water accumulation.",
        "Inspection effectiveness remains Medium until the 2024 UT mapping package is validated.",
        "Open RFI for H2S content should be resolved before PoF sign-off.",
      ],
      actions: [
        { label: "Open PoF Step", href: stepRoute("pof-evaluation") },
        { label: "View Inspection History", href: APP_ROUTES.inspections.history },
      ],
    },
    {
      stepId: "cof-evaluation",
      title: "CoF Evaluation",
      statusText: "Pending consequence review",
      narrative:
        "Consequence screening is staged for safety, environmental, production, and financial impact categories.",
      metrics: [
        { label: "Preliminary CoF", value: "4.1 / 5", tone: "red" },
        { label: "Production exposure", value: "16,500 BOPD", tone: "blue" },
        { label: "Scenario cards", value: "4", tone: "slate" },
      ],
      bullets: [
        "Safety and environmental consequence categories are flagged for Technical Authority review.",
        "Production impact references crude export handling and associated gas interfaces.",
        "Financial exposure should be validated after mitigation scenario assumptions are finalized.",
      ],
      actions: [
        { label: "Open CoF Step", href: stepRoute("cof-evaluation") },
        { label: "View Risk Analytics", href: APP_ROUTES.rbi.riskAnalytics },
      ],
    },
    {
      stepId: "risk-target",
      title: "Risk Target",
      statusText: "Target criteria pending approval",
      narrative:
        "Current risk is positioned in the Medium-High zone; target risk basis will be confirmed after PoF/CoF review.",
      metrics: [
        { label: "Current zone", value: "Medium-High", tone: "orange" },
        { label: "Target zone", value: "Medium", tone: "emerald" },
        { label: "Rank", value: "15 / 142", tone: "violet" },
      ],
      bullets: [
        "Target is expected to move the asset below the high-attention threshold after evidence closure and mitigation planning.",
        "Acceptance basis references inspection effectiveness, evidence quality, and mitigation endorsement.",
        "Risk matrix position remains traceable to Risk Register and Risk Analytics pages.",
      ],
      actions: [
        { label: "Open Risk Target", href: stepRoute("risk-target") },
        { label: "View Risk Register", href: APP_ROUTES.rbi.riskRegister },
      ],
    },
    {
      stepId: "inspection-mitigation-plan",
      title: "Inspection & Mitigation Plan",
      statusText: "Draft actions prepared",
      narrative:
        "Recommended inspection and mitigation actions are prepared as a shell preview pending DMR and PoF/CoF closure.",
      metrics: [
        { label: "Recommended actions", value: "5", tone: "blue" },
        { label: "High priority", value: "2", tone: "red" },
        { label: "Due within 30 days", value: "3", tone: "orange" },
      ],
      bullets: [
        "Complete UT/CML review at shell lower course and low-point drain.",
        "Validate PSV-1203 set-pressure documentation and calibration evidence.",
        "Plan insulation removal verification around N2/N3 and support areas.",
      ],
      actions: [
        { label: "Open Mitigation Plan", href: stepRoute("inspection-mitigation-plan") },
        { label: "Open Recommendations", href: APP_ROUTES.anomalies.recommendations },
      ],
    },
    {
      stepId: "review-acceptance",
      title: "Review & Acceptance",
      statusText: "Pending acceptance gates",
      narrative:
        "Final acceptance is blocked until mandatory review comments, RFIs, PoF/CoF approval, and mitigation endorsement are closed.",
      metrics: [
        { label: "Open comments", value: "6", tone: "orange" },
        { label: "Unresolved RFIs", value: "2", tone: "red" },
        { label: "Pending gates", value: "3", tone: "violet" },
      ],
      bullets: [
        "Technical Authority assignment is still pending.",
        "Final acceptance depends on DMR closure and PoF/CoF approval.",
        "Evidence pack should be reviewed before submit-for-acceptance.",
      ],
      actions: [
        { label: "Open Acceptance", href: stepRoute("review-acceptance") },
        { label: "View Governance Workflow", href: "/administration/approval-workflows" },
      ],
    },
  ],
  damageMechanisms: [
    {
      id: "internal-co2-corrosion",
      mechanism: "Internal CO2 Corrosion",
      category: "internal-corrosion",
      screeningResult: "Applicable",
      confidence: "High",
      evidenceSummary: "UT 2025 shows wall loss at shell course near low-point drain",
      affectedComponent: "Shell lower course / low-point drain",
      severityDriver: "Pressure, temperature, water accumulation",
      dataQuality: "Good",
      reviewerNote: "Use as primary thinning mechanism for PoF basis.",
    },
    {
      id: "h2s-susceptibility",
      mechanism: "H2S-Related Susceptibility",
      category: "internal-corrosion",
      screeningResult: "Requires Clarification",
      confidence: "Medium",
      evidenceSummary: "RFI open for H2S content confirmation from process chemistry",
      affectedComponent: "Entire pressure boundary",
      severityDriver: "H2S partial pressure",
      dataQuality: "Fair",
      reviewerNote: "Await chemistry confirmation before final screening closure.",
    },
    {
      id: "localized-pitting",
      mechanism: "Localized Pitting Corrosion",
      category: "internal-corrosion",
      screeningResult: "Monitor",
      confidence: "Medium",
      evidenceSummary: "NDT report pending validation, spot UT referenced",
      affectedComponent: "Shell ID and inlet nozzle N1",
      severityDriver: "Flow erosion, deposit",
      dataQuality: "Fair",
      reviewerNote: "Keep as monitored mechanism until spot UT package is approved.",
    },
    {
      id: "under-deposit",
      mechanism: "Under-Deposit Corrosion",
      category: "internal-corrosion",
      screeningResult: "Applicable",
      confidence: "High",
      evidenceSummary: "Produced-water carryover history intermittent; sludge found in 2024",
      affectedComponent: "Shell bottom / sump area",
      severityDriver: "Water accumulation, deposition",
      dataQuality: "Fair",
      reviewerNote: "Cross-check with operating water cut and cleaning history.",
    },
    {
      id: "external-atmospheric",
      mechanism: "External Atmospheric Corrosion",
      category: "external-corrosion",
      screeningResult: "Monitor",
      confidence: "Medium",
      evidenceSummary: "External CUI survey zones identified; coating holiday detected",
      affectedComponent: "External shell",
      severityDriver: "Coating age, environment",
      dataQuality: "Good",
      reviewerNote: "Monitor coating repair history and external inspection closure.",
    },
    {
      id: "cui",
      mechanism: "Corrosion Under Insulation (CUI)",
      category: "external-corrosion",
      screeningResult: "Applicable",
      confidence: "High",
      evidenceSummary: "Insulation removed at nozzle N2 shows coating breakdown",
      affectedComponent: "Nozzles N2/N3 and supports",
      severityDriver: "Insulation condition, moisture",
      dataQuality: "Poor",
      reviewerNote: "Mandatory evidence gap before PoF sign-off.",
    },
    {
      id: "flange-gasket",
      mechanism: "Flange Leakage / Gasket Degradation",
      category: "mechanical-integrity",
      screeningResult: "Monitor",
      confidence: "Medium",
      evidenceSummary: "Minor weeping observed at manway MW-1 during 2025 test",
      affectedComponent: "Manways, nozzles, sampling points",
      severityDriver: "Pressure cycling, gasket age",
      dataQuality: "Fair",
      reviewerNote: "Link to maintenance leak log once available.",
    },
    {
      id: "nozzle-coating",
      mechanism: "Nozzle Coating Breakdown",
      category: "external-corrosion",
      screeningResult: "Applicable",
      confidence: "Medium",
      evidenceSummary: "Coating breakdown at N2/N3; surface rust present",
      affectedComponent: "Nozzles N2/N3",
      severityDriver: "Coating system, UV exposure",
      dataQuality: "Poor",
      reviewerNote: "Treat as CUI-supporting evidence for mitigation plan.",
    },
    {
      id: "cml-tml-thinning",
      mechanism: "Thinning at CML/TML Locations",
      category: "internal-corrosion",
      screeningResult: "Monitor",
      confidence: "Medium",
      evidenceSummary: "UT trending indicates approximately 10% loss near low-point",
      affectedComponent: "CML 0°, TML 180° locations",
      severityDriver: "Fluid level fluctuation",
      dataQuality: "Good",
      reviewerNote: "Trend slope needs validation against 2024 mapping package.",
    },
    {
      id: "psv-document-mismatch",
      mechanism: "PSV Set-Pressure Document Mismatch",
      category: "documentation-control",
      screeningResult: "Requires Clarification",
      confidence: "Medium",
      evidenceSummary: "PSV-1203 set pressure document mismatch, 265 vs 270 psig",
      affectedComponent: "Linked PSV-1203",
      severityDriver: "Overpressure protection",
      dataQuality: "Poor",
      reviewerNote: "Open RFI to certification team and document controller.",
    },
  ],
  accordionSections: [
    {
      id: "linked-circuits",
      title: "Linked Circuits & CML/TML",
      items: [
        "CIR-CRUDE-02 is the primary corrosion loop for wet crude inlet separation.",
        "CML 0° and TML 180° are flagged for trend validation before PoF approval.",
        "LINE-6-OIL-101 remains linked for outlet corrosion and erosion-corrosion context.",
      ],
    },
    {
      id: "document-pack",
      title: "Document & Evidence Pack",
      items: [
        "14 files linked to the current RBI assessment package.",
        "2024 UT thickness mapping and PSV-1203 calibration package are pending validation.",
        "One critical attachment is missing for PSV set-pressure verification.",
      ],
    },
    {
      id: "review-notes",
      title: "Review Notes",
      items: [
        "Corrosion engineer requested H2S content confirmation from process chemistry.",
        "Inspection lead requested external CUI photo log for nozzles N2/N3.",
        "Technical Authority assignment is pending for acceptance gate review.",
      ],
    },
  ],
  linkedAssetContext: [
    { label: "Equipment Tag", value: "V-101", href: assetRoute("v-101") },
    { label: "Design Code", value: "ASME Sec. VIII Div. 1 style reference" },
    { label: "Material", value: "Carbon Steel SA-516 Gr.70" },
    { label: "Design Pressure", value: "285 psig" },
    { label: "Operating Pressure", value: "165 psig" },
    { label: "Operating Temperature", value: "68°C" },
    { label: "Design Temperature", value: "100°C" },
    { label: "Fluid", value: "Wet Crude / Gas / Water" },
    { label: "Corrosion Loop", value: "CIR-CRUDE-02", href: withQuery(APP_ROUTES.rbi.riskRegister, { asset: "CIR-CRUDE-02" }) },
    { label: "Linked Line", value: "LINE-6-OIL-101", href: assetRoute("line-6-oil-101") },
    { label: "Linked PSV", value: "PSV-1203", href: assetRoute("psv-1203") },
    { label: "Linked SDV", value: "SDV-701", href: assetRoute("sdv-701") },
  ],
  historicalInspections: [
    {
      year: "2023",
      title: "Internal Visual Inspection",
      status: "Validated",
      href: withQuery(APP_ROUTES.inspections.history, { asset: "V-101", record: "2023-ivi" }),
    },
    {
      year: "2024",
      title: "UT Thickness Mapping",
      status: "Pending Validation",
      href: withQuery(APP_ROUTES.inspections.history, { asset: "V-101", record: "2024-ut" }),
    },
    {
      year: "2025",
      title: "External Inspection / CUI Survey",
      status: "Evidence Incomplete",
      href: withQuery(APP_ROUTES.inspections.history, { asset: "V-101", record: "2025-cui" }),
    },
    {
      year: "2026",
      title: "RBI Kickoff & Data Collection",
      status: "In Progress",
      href: withQuery(APP_ROUTES.rbi.assessments, { asset: "V-101", campaign: "2026" }),
    },
  ],
  riskMatrix: Array.from({ length: 25 }, (_, index) => {
    const probability = Math.floor(index / 5) + 1;
    const consequence = (index % 5) + 1;

    return {
      probability,
      consequence,
      label: riskLabel(probability, consequence),
    };
  }),
  currentRiskPosition: {
    probability: 3,
    consequence: 4,
    label: "Medium-High",
  },
  keyIntegrityConcerns: [
    "Low-point water accumulation and under-deposit corrosion risk.",
    "Localized thinning near outlet nozzle N3 and low-point shell.",
    "Missing calibration evidence for linked PSV-1203 package.",
    "Incomplete P&ID revision control, Rev. 4 versus as-built.",
    "Overdue NDT report validation for 2024 UT mapping.",
  ],
  statusPanel: {
    overallCompleteness: 72,
    sectionCompleteness: [
      { label: "Assessment Basis", status: "completed", completeness: 100 },
      { label: "Asset Operating Info", status: "completed", completeness: 100 },
      { label: "Damage Mechanism Review", status: "in-progress", completeness: 68 },
      { label: "PoF Evaluation", status: "pending", completeness: 38 },
      { label: "CoF Evaluation", status: "pending", completeness: 34 },
      { label: "Risk Target", status: "pending", completeness: 25 },
      { label: "Inspection & Mitigation Plan", status: "pending", completeness: 18 },
      { label: "Review & Acceptance", status: "pending", completeness: 12 },
    ],
    reviewStage: "Technical Review Stage 1",
    stakeholders: [
      { role: "RBI Analyst", status: "Assigned" },
      { role: "Corrosion Engineer", status: "Assigned" },
      { role: "Inspection Lead", status: "Assigned" },
      { role: "Technical Authority", status: "Pending" },
    ],
    reviewHealth: {
      openComments: 6,
      unresolvedRfis: 2,
      pendingAcceptanceDecisions: 1,
    },
    dataQualityScore: 78,
    evidenceCoverageScore: 81,
    documentPackage: {
      filesLinked: 14,
      pendingValidation: 3,
      missingCriticalAttachment: 1,
    },
    acceptanceGates: [
      { label: "Methodology selected", status: "complete" },
      { label: "Operating envelope confirmed", status: "complete" },
      { label: "Damage review completed", status: "in-progress" },
      { label: "PoF/CoF approved", status: "pending" },
      { label: "Mitigation plan endorsed", status: "pending" },
      { label: "Final acceptance", status: "pending" },
    ],
  },
  evidenceItems: [
    {
      id: "ev-001",
      title: "V-101 datasheet and design basis",
      type: "Asset data",
      status: "Linked",
      href: withQuery(APP_ROUTES.documents.register, { asset: "V-101", type: "datasheet" }),
    },
    {
      id: "ev-002",
      title: "2024 UT thickness mapping package",
      type: "Inspection evidence",
      status: "Pending Validation",
      href: withQuery(APP_ROUTES.inspections.history, { asset: "V-101", record: "2024-ut" }),
    },
    {
      id: "ev-003",
      title: "PSV-1203 set-pressure and calibration package",
      type: "Certification evidence",
      status: "Missing Critical",
      href: withQuery(APP_ROUTES.certification.evidencePack, { asset: "PSV-1203" }),
    },
    {
      id: "ev-004",
      title: "External CUI survey photo log",
      type: "Document control",
      status: "Pending Validation",
      href: withQuery(APP_ROUTES.documents.register, { asset: "V-101", issue: "cui" }),
    },
  ],
  routes: {
    assessmentsList: APP_ROUTES.rbi.assessments,
    assetProfile: assetRoute("v-101"),
    riskRegister: withQuery(APP_ROUTES.rbi.riskRegister, { asset: "V-101" }),
    riskAnalytics: withQuery(APP_ROUTES.rbi.riskAnalytics, { asset: "V-101" }),
    inspectionHistory: withQuery(APP_ROUTES.inspections.history, { asset: "V-101" }),
    evidencePack: withQuery(APP_ROUTES.certification.evidencePack, { asset: "V-101" }),
    documents: withQuery(APP_ROUTES.documents.register, { asset: "V-101" }),
    anomalies: withQuery(APP_ROUTES.anomalies.register, { asset: "V-101" }),
    recommendations: withQuery(APP_ROUTES.anomalies.recommendations, { asset: "V-101" }),
    governance: "/administration/approval-workflows",
  },
};
