import { Injectable } from "@nestjs/common";

import type { UploadStandardDocumentMetadataRequest } from "@aim-rbi/contracts";

import { StandardsKnowledgeRepository } from "../standards-knowledge/standards-knowledge.repository";

@Injectable()
export class DocumentsService {
  constructor(private readonly repository: StandardsKnowledgeRepository) {}

  registerStandardUploadMetadata(request: UploadStandardDocumentMetadataRequest, actorId = "system") {
    return this.repository.registerUploadMetadata(request, actorId);
  }
}
