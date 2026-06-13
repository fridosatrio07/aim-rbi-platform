import { ConflictException, Injectable } from "@nestjs/common";

import type { ActivateRuleRequest, ApplicabilityCheckRequest } from "@aim-rbi/contracts";

import { assertRequirementCanActivate } from "../standards-knowledge/standards-knowledge.policy";
import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class RulesService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  list(status?: string) {
    return { items: this.repository.listRules(status) };
  }

  activate(request: ActivateRuleRequest) {
    const requirement = this.repository
      .listRequirements()
      .find((item) => item.id === request.approvedRequirementId);

    try {
      assertRequirementCanActivate(requirement?.status ?? "draft", request.authorityLevel);
    } catch (error) {
      throw new ConflictException(error instanceof Error ? error.message : "Rule activation failed.");
    }

    return this.repository.createRule(request);
  }

  checkApplicability(request: ApplicabilityCheckRequest) {
    const applicableStandards = this.repository.resolveApplicability(request.assetContext);
    return {
      assetContext: request.assetContext,
      applicableStandards,
      outputStatus: "preliminary",
      warnings:
        applicableStandards.length === 0
          ? ["No approved or active rule matched this asset context. SME review is required."]
          : [],
      limitationStatement:
        "Applicability is rule-assisted guidance only and must be reviewed for project-specific regulatory scope.",
    };
  }
}
