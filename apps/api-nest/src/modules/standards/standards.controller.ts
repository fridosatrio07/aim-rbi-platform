import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";

import type { CreateStandardDocumentRequest, StandardsLibraryQuery } from "@aim-rbi/contracts";
import type { DocumentStatus } from "@aim-rbi/domain";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { StandardsService } from "./standards.service";

@UseGuards(RoleGuard)
@Controller("standards")
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Get()
  list(@Query() query: StandardsLibraryQuery) {
    return this.standardsService.list(query);
  }

  @Post()
  @Roles("superadmin", "admin")
  create(@Body() body: CreateStandardDocumentRequest, @Headers("x-user-id") actorId?: string) {
    return this.standardsService.create(body, actorId);
  }

  @Get(":standardId")
  get(@Param("standardId") standardId: string) {
    return this.standardsService.get(standardId);
  }

  @Patch(":standardId/status")
  @Roles("superadmin", "admin")
  updateStatus(
    @Param("standardId") standardId: string,
    @Body("status") status: DocumentStatus,
    @Headers("x-user-id") actorId?: string,
  ) {
    return this.standardsService.updateStatus(standardId, status, actorId);
  }
}
