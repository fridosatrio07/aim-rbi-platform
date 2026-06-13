import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";

import type { EvidencePackGenerationRequest } from "@aim-rbi/contracts";
import type { EvidenceRequirement } from "@aim-rbi/domain";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { EvidenceService } from "./evidence.service";

@UseGuards(RoleGuard)
@Controller("evidence")
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get("requirements")
  listRequirements() {
    return this.evidenceService.listRequirements();
  }

  @Post("requirements")
  @Roles("superadmin", "admin", "SME")
  createRequirement(@Body() body: Omit<EvidenceRequirement, "id" | "createdAt" | "updatedAt">) {
    return this.evidenceService.createRequirement(body);
  }

  @Post("pack-draft")
  generatePackDraft(@Body() body: EvidencePackGenerationRequest) {
    return this.evidenceService.generatePackDraft(body);
  }
}
