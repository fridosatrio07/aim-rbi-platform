import { BadRequestException, Injectable } from "@nestjs/common";

import type {
  ApplicabilityCheckRequest,
  CorrosionCalculationRequest,
  DocumentCompletenessCheckRequest,
  DraftFindingRecommendationRequest,
  DraftInspectionPlanRequest,
  DueDateCalculationRequest,
  PreliminaryRiskRankingRequest,
} from "@aim-rbi/contracts";

import { guardFinalAuthorityOutput, requiredReviewForDataQuality } from "../standards-knowledge/standards-knowledge.policy";
import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class AnalysisService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  applicableStandards(request: ApplicabilityCheckRequest) {
    return {
      assetContext: request.assetContext,
      applicableStandards: this.repository.resolveApplicability(request.assetContext),
      outputStatus: "preliminary",
      warnings: [],
      limitationStatement:
        "Applicable standards/regulations are selected from approved rules as guidance and require project governance review.",
    };
  }

  documentCompleteness(request: DocumentCompletenessCheckRequest) {
    return this.repository.checkCompleteness(request.requiredFields, request.availableFields);
  }

  corrosionRate(request: CorrosionCalculationRequest) {
    return this.repository.calculateCorrosionRate(request);
  }

  dueDate(request: DueDateCalculationRequest) {
    return this.repository.calculateDueDate(request.candidates);
  }

  preliminaryRisk(request: PreliminaryRiskRankingRequest) {
    return this.repository.rankRisk(request);
  }

  draftInspectionPlan(request: DraftInspectionPlanRequest) {
    const reviewRole = requiredReviewForDataQuality(request.dataQualityStatus ?? "assumed") ?? "engineer";
    return {
      outputStatus: "draft",
      planSummary:
        "Draft inspection plan generated from applicable rules, known damage mechanisms, and data quality flags.",
      proposedMethods: request.knownDamageMechanisms?.length
        ? ["Select NDE methods aligned with reviewed damage mechanisms", "Confirm coverage with responsible engineer"]
        : ["Complete damage mechanism review", "Select inspection methods after SME review"],
      warnings:
        request.dataQualityStatus === "verified"
          ? []
          : ["Input basis is not fully verified; draft plan requires engineer review before issue."],
      requiredReviewRole: reviewRole,
      limitationStatement:
        "Draft plan is not an approved inspection workpack and cannot extend intervals or close regulatory obligations automatically.",
    };
  }

  draftFindingRecommendation(request: DraftFindingRecommendationRequest) {
    try {
      guardFinalAuthorityOutput(`${request.findingBasis}`);
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : "Final authority output is blocked.");
    }

    return {
      outputStatus: "draft",
      findingDraft: `Draft finding based on provided basis: ${request.findingBasis}`,
      recommendationDraft:
        "Review evidence, verify data quality, confirm applicable rule basis, and assign engineer-owned close-out action.",
      warnings:
        request.dataQualityStatus === "verified"
          ? []
          : ["Data quality is not fully verified; recommendation must remain draft."],
      requiredReviewRole: "engineer",
      limitationStatement:
        "Draft finding/recommendation is decision support only and is not final repair, alteration, rerating, FFS, RLA, PLO, or certificate approval.",
    };
  }
}
