import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";

import type { UploadStandardDocumentMetadataRequest } from "@aim-rbi/contracts";

import { Roles } from "../../common/decorators/roles.decorator";
import { RoleGuard } from "../../common/guards/role.guard";
import { DocumentsService } from "./documents.service";

@UseGuards(RoleGuard)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post("standards/upload-metadata")
  @Roles("superadmin", "admin")
  registerUploadMetadata(@Body() body: UploadStandardDocumentMetadataRequest, @Headers("x-user-id") actorId?: string) {
    return this.documentsService.registerStandardUploadMetadata(body, actorId);
  }
}
