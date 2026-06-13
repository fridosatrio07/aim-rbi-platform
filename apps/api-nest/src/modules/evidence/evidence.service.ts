import { Injectable } from "@nestjs/common";

import type { EvidencePackGenerationRequest } from "@aim-rbi/contracts";
import type { EvidenceRequirement } from "@aim-rbi/domain";

import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class EvidenceService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  listRequirements() {
    return { items: this.repository.listEvidenceRequirements() };
  }

  createRequirement(request: Omit<EvidenceRequirement, "id" | "createdAt" | "updatedAt">) {
    return this.repository.upsertEvidenceRequirement(request);
  }

  generatePackDraft(request: EvidencePackGenerationRequest) {
    const evidencePack = this.repository.createEvidencePack({
      assetContext: request.assetContext,
      applicableStandardVersionIds: request.applicableStandardVersionIds,
      evidenceRequirements: request.evidenceRequirements,
      availableEvidence: request.availableEvidence.map((item) => ({
        ...item,
        storageUri: undefined,
      })),
      analysisRunIds: request.analysisRunIds,
      generatedBy: request.generatedBy,
    });

    return {
      evidencePack,
      outputStatus: evidencePack.outputStatus,
      warnings:
        evidencePack.missingEvidence.length > 0
          ? ["Evidence pack has missing mandatory evidence and requires review."]
          : [],
      limitationStatement: evidencePack.limitationStatement,
    };
  }
}
