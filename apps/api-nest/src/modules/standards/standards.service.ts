import { Injectable, NotFoundException } from "@nestjs/common";

import type { CreateStandardDocumentRequest, StandardsLibraryQuery } from "@aim-rbi/contracts";
import type { DocumentStatus } from "@aim-rbi/domain";

import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class StandardsService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  list(query: StandardsLibraryQuery) {
    return { items: this.repository.listStandards(query) };
  }

  create(request: CreateStandardDocumentRequest, actorId = "system") {
    return this.repository.createStandard(request, actorId);
  }

  get(id: string) {
    const standard = this.repository.getStandard(id);
    if (!standard) throw new NotFoundException(`Standard not found: ${id}`);
    return standard;
  }

  updateStatus(id: string, status: DocumentStatus, actorId = "system") {
    try {
      return this.repository.updateStandardStatus(id, status, actorId);
    } catch {
      throw new NotFoundException(`Standard not found: ${id}`);
    }
  }
}
