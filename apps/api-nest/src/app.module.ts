import { Module } from "@nestjs/common";

import { AiOrchestrationModule } from "./modules/ai-orchestration/ai-orchestration.module";
import { AnalysisModule } from "./modules/analysis/analysis.module";
import { AuditModule } from "./modules/audit/audit.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { EvidenceModule } from "./modules/evidence/evidence.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { RulesModule } from "./modules/rules/rules.module";
import { StandardsKnowledgeModule } from "./modules/standards-knowledge/standards-knowledge.module";
import { StandardsModule } from "./modules/standards/standards.module";

@Module({
  imports: [
    StandardsKnowledgeModule,
    AuditModule,
    StandardsModule,
    DocumentsModule,
    AiOrchestrationModule,
    ReviewsModule,
    RulesModule,
    EvidenceModule,
    AnalysisModule,
  ],
})
export class AppModule {}
