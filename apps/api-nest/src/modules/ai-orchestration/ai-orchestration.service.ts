import { Injectable, NotFoundException } from "@nestjs/common";

import type { RequirementExtractionRequest, StartParsingJobRequest } from "@aim-rbi/contracts";

import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class AiOrchestrationService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  startParsingJob(request: StartParsingJobRequest) {
    return this.repository.createParsingJob(request);
  }

  startExtractionJob(request: RequirementExtractionRequest) {
    return this.repository.createExtractionJob(request.standardVersionId, request.requestedBy);
  }

  getJob(jobId: string) {
    const job = this.repository.getJob(jobId);
    if (!job) throw new NotFoundException(`Job not found: ${jobId}`);
    return job;
  }
}
