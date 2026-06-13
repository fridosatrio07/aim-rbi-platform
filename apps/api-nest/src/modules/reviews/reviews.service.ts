import { Injectable } from "@nestjs/common";

import type { RequirementReviewRequest } from "@aim-rbi/contracts";

import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class ReviewsService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  listRequirements(standardVersionId?: string) {
    return { items: this.repository.listRequirements(standardVersionId) };
  }

  reviewRequirement(request: RequirementReviewRequest) {
    return this.repository.reviewRequirement(
      request.requirementId,
      request.decision,
      request.reviewerId,
      request.reviewComment,
      request.editedSummary,
    );
  }
}
