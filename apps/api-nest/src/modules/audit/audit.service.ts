import { Injectable } from "@nestjs/common";

import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class AuditService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  listEvents() {
    return { items: this.repository.listAuditEvents() };
  }
}
