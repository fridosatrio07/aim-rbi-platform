import { Body, Controller, Post } from "@nestjs/common";

import type {
  ApplicabilityCheckRequest,
  CorrosionCalculationRequest,
  DocumentCompletenessCheckRequest,
  DraftFindingRecommendationRequest,
  DraftInspectionPlanRequest,
  DueDateCalculationRequest,
  PreliminaryRiskRankingRequest,
} from "@aim-rbi/contracts";

import { AnalysisService } from "./analysis.service";

@Controller("analysis")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post("applicable-standards")
  applicableStandards(@Body() body: ApplicabilityCheckRequest) {
    return this.analysisService.applicableStandards(body);
  }

  @Post("document-completeness")
  documentCompleteness(@Body() body: DocumentCompletenessCheckRequest) {
    return this.analysisService.documentCompleteness(body);
  }

  @Post("corrosion-rate")
  corrosionRate(@Body() body: CorrosionCalculationRequest) {
    return this.analysisService.corrosionRate(body);
  }

  @Post("due-date")
  dueDate(@Body() body: DueDateCalculationRequest) {
    return this.analysisService.dueDate(body);
  }

  @Post("preliminary-risk")
  preliminaryRisk(@Body() body: PreliminaryRiskRankingRequest) {
    return this.analysisService.preliminaryRisk(body);
  }

  @Post("draft-inspection-plan")
  draftInspectionPlan(@Body() body: DraftInspectionPlanRequest) {
    return this.analysisService.draftInspectionPlan(body);
  }

  @Post("draft-finding-recommendation")
  draftFindingRecommendation(@Body() body: DraftFindingRecommendationRequest) {
    return this.analysisService.draftFindingRecommendation(body);
  }
}
