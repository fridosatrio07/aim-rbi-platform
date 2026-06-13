import type { AutomationAuthorityLevel, DataQualityStatus, RequirementStatus } from "@aim-rbi/domain";

const FINAL_AUTHORITY_PATTERNS = [
  /fit\s*for\s*service/i,
  /fit\s*for\s*operation/i,
  /safe\s*to\s*operate/i,
  /layak\s*operasi/i,
  /final\s*(FFS|RLA|PLO)/i,
  /certificate\s*ready/i,
  /approve\s*(repair|alteration|rerating)/i,
  /extend\s*inspection\s*interval/i,
];

export function guardFinalAuthorityOutput(text: string) {
  const matched = FINAL_AUTHORITY_PATTERNS.find((pattern) => pattern.test(text));

  if (matched) {
    throw new Error(
      "Final engineering, FFS/RLA/PLO, safe operation, interval extension, repair/alteration/rerating, or certificate readiness declarations are blocked without authorized human review.",
    );
  }
}

export function assertRequirementCanActivate(status: RequirementStatus, authorityLevel: AutomationAuthorityLevel) {
  if (status !== "approved" && status !== "active") {
    throw new Error("Draft or unreviewed extracted requirements cannot become active rules.");
  }

  if (authorityLevel === "prohibited") {
    throw new Error("Rules with prohibited authority cannot be activated for automated output.");
  }
}

export function requiredReviewForDataQuality(dataQualityStatus: DataQualityStatus) {
  return dataQualityStatus === "verified" ? undefined : "engineer";
}
