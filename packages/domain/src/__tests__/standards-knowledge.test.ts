import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateSimpleCorrosionRate,
  classifyDataCompleteness,
  getConservativeDueDate,
  isHumanApprovalRequired,
  normalizeStandardCode,
  resolveApplicableStandards,
  type RuleSet,
} from "../standards-knowledge/index.js";

test("conservative due date chooses the earliest valid date", () => {
  const result = getConservativeDueDate([
    { source: "RBI", date: "2028-06-01" },
    { source: "owner", date: "2027-10-15" },
    { source: "statutory", date: "2027-06-30" },
  ]);

  assert.equal(result.selectedDate, "2027-06-30");
  assert.equal(result.selectedCandidate?.source, "statutory");
  assert.match(result.warnings.join(" "), /RBI interval/);
});

test("corrosion rate warns on invalid date order", () => {
  const result = calculateSimpleCorrosionRate(10, 9.5, "2026-01-01", "2025-01-01");

  assert.equal(result.status, "requires_engineer_review");
  assert.match(result.warnings[0], /after previous/);
});

test("human approval is required for final authority outputs", () => {
  assert.equal(isHumanApprovalRequired("automatic_allowed"), false);
  assert.equal(isHumanApprovalRequired("final_FFS"), true);
  assert.equal(isHumanApprovalRequired("layak_operasi"), true);
  assert.equal(isHumanApprovalRequired("document_completeness"), false);
});

test("applicable standards match active rule conditions", () => {
  const rule: RuleSet = {
    id: "rule-api580-pressure-vessel",
    standardVersionId: "version-api580",
    standardCode: "API 580",
    standardTitle: "Risk-Based Inspection methodology metadata placeholder",
    publisher: "API",
    name: "Pressure vessel RBI applicability",
    description: "Metadata-only development rule.",
    status: "active",
    authorityLevel: "draft_only",
    conditions: [
      {
        id: "condition-1",
        ruleSetId: "rule-api580-pressure-vessel",
        industries: ["oil_gas"],
        equipmentApplicability: ["pressure_vessel"],
        analysisApplicability: ["RBI"],
      },
    ],
    priority: 10,
    conflictPolicy: "most_conservative",
    createdAt: "2026-06-13T00:00:00.000Z",
    updatedAt: "2026-06-13T00:00:00.000Z",
  };

  const matches = resolveApplicableStandards(
    {
      industry: "oil_gas",
      equipmentClass: "pressure_vessel",
      analysisType: "RBI",
    },
    [rule],
  );

  assert.equal(matches.length, 1);
  assert.equal(matches[0].standardCode, "API 580");
});

test("data completeness identifies missing fields", () => {
  const result = classifyDataCompleteness(["datasheet", "thickness_history"], { datasheet: "linked" });

  assert.equal(result.status, "partially_verified");
  assert.deepEqual(result.missingFields, ["thickness_history"]);
});

test("standard code normalization is stable", () => {
  assert.equal(normalizeStandardCode(" api-580 "), "API 580");
});
