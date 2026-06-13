import {
  assertRequirementCanActivate,
  guardFinalAuthorityOutput,
  requiredReviewForDataQuality,
} from "../src/modules/standards-knowledge/standards-knowledge.policy";

describe("standards knowledge governance policy", () => {
  it("blocks draft extraction activation", () => {
    expect(() => assertRequirementCanActivate("draft", "draft_only")).toThrow(/cannot become active/);
  });

  it("blocks final safe operation declarations", () => {
    expect(() => guardFinalAuthorityOutput("Asset is fit for service and safe to operate")).toThrow(/blocked/);
  });

  it("requires review when analysis data is missing", () => {
    expect(requiredReviewForDataQuality("missing")).toBe("engineer");
  });
});
