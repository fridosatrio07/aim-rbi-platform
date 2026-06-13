import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import type { RequirementExtractionRequest, StartParsingJobRequest } from "@aim-rbi/contracts";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { AiOrchestrationService } from "./ai-orchestration.service";

@UseGuards(RoleGuard)
@Controller("ai-orchestration")
export class AiOrchestrationController {
  constructor(private readonly aiOrchestrationService: AiOrchestrationService) {}

  @Post("parsing-jobs")
  @Roles("superadmin", "admin")
  startParsingJob(@Body() body: StartParsingJobRequest) {
    return this.aiOrchestrationService.startParsingJob(body);
  }

  @Get("parsing-jobs/:jobId")
  getParsingJob(@Param("jobId") jobId: string) {
    return this.aiOrchestrationService.getJob(jobId);
  }

  @Post("extraction-jobs")
  @Roles("superadmin", "admin", "SME")
  startExtractionJob(@Body() body: RequirementExtractionRequest) {
    return this.aiOrchestrationService.startExtractionJob(body);
  }

  @Get("extraction-jobs/:jobId")
  getExtractionJob(@Param("jobId") jobId: string) {
    return this.aiOrchestrationService.getJob(jobId);
  }
}
