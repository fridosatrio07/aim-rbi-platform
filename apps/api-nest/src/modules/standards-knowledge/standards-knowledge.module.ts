import { Global, Module } from "@nestjs/common";

import { StandardsKnowledgeRepository } from "./standards-knowledge.repository";

@Global()
@Module({
  providers: [StandardsKnowledgeRepository],
  exports: [StandardsKnowledgeRepository],
})
export class StandardsKnowledgeModule {}
