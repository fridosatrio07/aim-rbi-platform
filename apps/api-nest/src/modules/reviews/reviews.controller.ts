import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";

import type { RequirementReviewRequest } from "@aim-rbi/contracts";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { ReviewsService } from "./reviews.service";

@UseGuards(RoleGuard)
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("requirements")
  listRequirements(@Query("standardVersionId") standardVersionId?: string) {
    return this.reviewsService.listRequirements(standardVersionId);
  }

  @Post("requirements/:requirementId")
  @Roles("superadmin", "admin", "SME", "engineer", "legal")
  reviewRequirement(@Param("requirementId") requirementId: string, @Body() body: RequirementReviewRequest) {
    return this.reviewsService.reviewRequirement({ ...body, requirementId });
  }
}
