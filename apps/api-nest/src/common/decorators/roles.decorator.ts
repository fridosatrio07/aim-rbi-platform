import { SetMetadata } from "@nestjs/common";

export const REQUIRED_ROLES_KEY = "requiredRoles";

export type KnowledgeRole = "superadmin" | "admin" | "SME" | "engineer" | "legal" | "regulatory";

export const Roles = (...roles: KnowledgeRole[]) => SetMetadata(REQUIRED_ROLES_KEY, roles);
