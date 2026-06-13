import { Controller, Get, UseGuards } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { AuditService } from "./audit.service";

@UseGuards(RoleGuard)
@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("events")
  @Roles("superadmin", "admin")
  listEvents() {
    return this.auditService.listEvents();
  }
}
