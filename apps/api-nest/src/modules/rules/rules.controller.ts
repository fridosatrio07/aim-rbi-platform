import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";

import type { ActivateRuleRequest, ApplicabilityCheckRequest } from "@aim-rbi/contracts";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { RulesService } from "./rules.service";

@UseGuards(RoleGuard)
@Controller("rules")
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  list(@Query("status") status?: string) {
    return this.rulesService.list(status);
  }

  @Post("activate")
  @Roles("superadmin", "admin", "SME")
  activate(@Body() body: ActivateRuleRequest) {
    return this.rulesService.activate(body);
  }

  @Post("applicability")
  checkApplicability(@Body() body: ApplicabilityCheckRequest) {
    return this.rulesService.checkApplicability(body);
  }
}
